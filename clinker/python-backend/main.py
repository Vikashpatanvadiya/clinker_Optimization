import json
import os
import math
from datetime import datetime
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ortools.linear_solver import pywraplp

app = FastAPI(title="AdaniClinkerSolver-SCIP")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    from_plant: str
    to_plant: str
    demand: float = Field(..., gt=0)
    period: str = "2026-06"
    carbon_tax: float = 0.0

class VehicleType(BaseModel):
    mode: str
    vehicle_type: str
    capacity_t: float
    compartments: Dict[str, Any]
    cost_fixed: float
    cost_per_km: float
    speed_kmh: float
    fuel_eff_laden: float
    fuel_eff_empty: float
    empty_return_pct: float
    axle_penalty_per_t: float
    carbon_g_per_tkm: float

class Lane(BaseModel):
    origin: str
    dest: str
    distance_km: float
    toll_road: float
    rail_siding_cost: float
    rail_demurrage_h: float
    monsoon_delay_pct: float
    vehicles: List[VehicleType]

LANES: Dict[str, Lane] = {}

@app.on_event("startup")
def load():
    global LANES
    
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    path = "data/adani_network.json"
    if not os.path.exists(path):
        # Create minimal lane for demo with Indian Rupee values
        lane = {
            "origin": "IU_Karnataka", 
            "dest": "GU_Odisha", 
            "distance_km": 1240,
            "toll_road": 150.0,  # ₹150 per tonne (converted from $1.8)
            "rail_siding_cost": 3750000,  # ₹37.5 lakh (converted from $45000)
            "rail_demurrage_h": 5,
            "monsoon_delay_pct": 12,
            "vehicles": [
                {
                    "mode": "road",
                    "vehicle_type": "32T_Bulker",
                    "capacity_t": 26,
                    "compartments": {"count": 3, "min_t": 8, "max_t": 9.5},
                    "cost_fixed": 41700,  # ₹41,700 (converted from $500)
                    "cost_per_km": 3500,  # ₹3,500 per km (converted from $42)
                    "speed_kmh": 55,
                    "fuel_eff_laden": 3.2,
                    "fuel_eff_empty": 4.5,
                    "empty_return_pct": 0.15,
                    "axle_penalty_per_t": 20850,  # ₹20,850 (converted from $250)
                    "carbon_g_per_tkm": 65
                },
                {
                    "mode": "rail",
                    "vehicle_type": "59_BOXNHL",
                    "capacity_t": 3540,
                    "compartments": {"count": 59, "min_t": 60, "max_t": 60},
                    "cost_fixed": 0,
                    "cost_per_km": 0,
                    "speed_kmh": 45,
                    "fuel_eff_laden": 4.2,
                    "fuel_eff_empty": 4.5,
                    "empty_return_pct": 0,
                    "axle_penalty_per_t": 0,
                    "carbon_g_per_tkm": 22
                }
            ]
        }
        
        # Add more demo lanes
        demo_lanes = [
            lane,
            {
                "origin": "IU_Gujarat", 
                "dest": "GU_Maharashtra", 
                "distance_km": 450,
                "toll_road": 120.0,
                "rail_siding_cost": 2500000,
                "rail_demurrage_h": 4,
                "monsoon_delay_pct": 8,
                "vehicles": [
                    {
                        "mode": "road",
                        "vehicle_type": "25T_Truck",
                        "capacity_t": 22,
                        "compartments": {"count": 2, "min_t": 10, "max_t": 12},
                        "cost_fixed": 35000,
                        "cost_per_km": 2800,
                        "speed_kmh": 60,
                        "fuel_eff_laden": 3.8,
                        "fuel_eff_empty": 5.2,
                        "empty_return_pct": 0.12,
                        "axle_penalty_per_t": 18000,
                        "carbon_g_per_tkm": 58
                    }
                ]
            },
            {
                "origin": "IU_Rajasthan", 
                "dest": "GU_Punjab", 
                "distance_km": 680,
                "toll_road": 135.0,
                "rail_siding_cost": 3200000,
                "rail_demurrage_h": 6,
                "monsoon_delay_pct": 15,
                "vehicles": [
                    {
                        "mode": "road",
                        "vehicle_type": "40T_Trailer",
                        "capacity_t": 35,
                        "compartments": {"count": 4, "min_t": 8, "max_t": 10},
                        "cost_fixed": 50000,
                        "cost_per_km": 4200,
                        "speed_kmh": 50,
                        "fuel_eff_laden": 2.8,
                        "fuel_eff_empty": 4.0,
                        "empty_return_pct": 0.18,
                        "axle_penalty_per_t": 25000,
                        "carbon_g_per_tkm": 72
                    }
                ]
            }
        ]
        
        with open(path, "w") as f: 
            json.dump(demo_lanes, f, indent=2)
    
    with open(path) as f:
        lanes_data = json.load(f)
        LANES = {f"{l['origin']}->{l['dest']}": Lane(**l) for l in lanes_data}

class Trip(BaseModel):
    mode: str
    vehicle_type: str
    trips: int
    tonnes: float
    cost_breakdown: Dict[str, float]
    carbon_tCO2: float
    lead_time_h: float

class Response(BaseModel):
    total_cost: float
    total_carbon_tCO2: float
    trips: List[Trip]

def fuel_price(): 
    return 7370.0  # ₹73.70 per liter (converted from $88.4)

def elec_price(): 
    return 650.0  # ₹6.50 per kWh (converted from $7.8)

def rail_rate(d, t):  # piece-wise in INR
    base_rate = (1.15 if d <= 200 else 1.05 if d <= 500 else 0.98 if d <= 800 else 0.92 if d <= 1200 else 0.88)
    return base_rate * d * 83.4  # Convert to INR

@app.post("/solve_adani", response_model=Response)
def solve(req: Request):
    key = f"{req.from_plant}->{req.to_plant}"
    lane = LANES.get(key)
    if not lane: 
        raise HTTPException(status_code=404, detail=f"Lane {key} not found. Available lanes: {list(LANES.keys())}")
    
    try:
        solver = pywraplp.Solver.CreateSolver("SCIP")
        if not solver: 
            raise HTTPException(status_code=500, detail="SCIP solver unavailable")
        
        solver.SetSolverSpecificParametersAsString("limits/time=300")
        
        bigM = 1e5
        demand = req.demand
        monsoon = 1.12 if int(req.period.split("-")[1]) in (6, 7, 8, 9) else 1.0
        trip_vars = []
        
        for v in lane.vehicles:
            if v.mode == "road":
                max_trips = math.ceil(demand / v.capacity_t)
                n = solver.IntVar(0, max_trips, f"n_{v.mode}_{v.vehicle_type}")
                x = solver.NumVar(0, demand, f"x_{v.mode}_{v.vehicle_type}")
                comp_t = solver.IntVar(0, max_trips * v.compartments["count"], f"comp_{v.vehicle_type}")
                
                solver.Add(x <= comp_t * v.compartments["max_t"])
                solver.Add(x >= comp_t * v.compartments["min_t"])
                solver.Add(comp_t <= v.compartments["count"] * n)
                solver.Add(x <= v.capacity_t * n)
                solver.Add(x >= v.compartments["min_t"] * v.compartments["count"] * n)
                
                laden = lane.distance_km * x
                empty = laden * v.empty_return_pct
                fcost = (laden / v.fuel_eff_laden + empty / v.fuel_eff_empty) * fuel_price()
                toll = lane.toll_road * x
                
                ax_over = solver.NumVar(0, bigM, f"ax_over_{v.vehicle_type}")
                solver.Add(x <= v.capacity_t * n + ax_over)
                penalty = ax_over * v.axle_penalty_per_t
                
                variable = (fcost + toll + penalty) * monsoon
                carbon = laden * v.carbon_g_per_tkm / 1000
                lead_time = lane.distance_km / v.speed_kmh * monsoon + 2
                
                trip_vars.append((n, v, x, variable + carbon * req.carbon_tax, carbon / 1000, lead_time, ax_over))
                
            elif v.mode == "rail":
                max_rakes = math.ceil(demand / v.capacity_t)
                n = solver.IntVar(0, max_rakes, f"n_{v.mode}_{v.vehicle_type}")
                x = solver.NumVar(0, demand, f"x_{v.mode}_{v.vehicle_type}")
                
                solver.Add(x == v.capacity_t * n)
                solver.Add(x >= v.compartments["min_t"] * n)
                
                rate = rail_rate(lane.distance_km, x) * x
                siding = lane.rail_siding_cost * n
                demurr = lane.rail_demurrage_h * n * 208500  # ₹2,085 per hour (converted from $2500)
                elec = (lane.distance_km * x / 100) * elec_price()
                
                variable = (rate + siding + demurr + elec) * monsoon
                carbon = lane.distance_km * x * v.carbon_g_per_tkm / 1000
                lead_time = lane.distance_km / v.speed_kmh * monsoon + 8
                
                trip_vars.append((n, v, x, variable + carbon * req.carbon_tax, carbon / 1000, lead_time, None))
        
        total_x = solver.Sum([tpl[2] for tpl in trip_vars])
        solver.Add(total_x == demand)
        solver.Minimize(solver.Sum([tpl[3] for tpl in trip_vars]))
        
        status = solver.Solve()
        if status not in (solver.OPTIMAL, solver.FEASIBLE):
            raise HTTPException(status_code=400, detail="Problem is infeasible")
        
        trips = []
        for n, v, x, cost_expr, co2_expr, lead, ax_over in trip_vars:
            if n.solution_value() > 0:
                x_val = x.solution_value()
                n_val = n.solution_value()
                laden = lane.distance_km * x_val
                carbon_tco2 = laden * v.carbon_g_per_tkm / 1000
                carbon_cost = carbon_tco2 * req.carbon_tax
                
                if v.mode == "road":
                    empty = laden * v.empty_return_pct
                    fcost = (laden / v.fuel_eff_laden + empty / v.fuel_eff_empty) * fuel_price()
                    toll = lane.toll_road * x_val
                    ax_over_val = ax_over.solution_value() if ax_over else 0
                    penalty = ax_over_val * v.axle_penalty_per_t
                    transport_cost = (fcost + toll + penalty) * monsoon
                    
                elif v.mode == "rail":
                    rate = rail_rate(lane.distance_km, x_val) * x_val
                    siding = lane.rail_siding_cost * n_val
                    demurr = lane.rail_demurrage_h * n_val * 208500
                    elec = (lane.distance_km * x_val / 100) * elec_price()
                    transport_cost = (rate + siding + demurr + elec) * monsoon
                else:
                    transport_cost = 0
                
                trips.append(Trip(
                    mode=v.mode,
                    vehicle_type=v.vehicle_type,
                    trips=int(n_val),
                    tonnes=round(x_val, 2),
                    cost_breakdown={
                        "transport": round(transport_cost, 2),
                        "carbon": round(carbon_cost, 2)
                    },
                    carbon_tCO2=round(carbon_tco2, 3),
                    lead_time_h=round(lead, 1)
                ))
        
        return Response(
            total_cost=round(solver.Objective().Value(), 2),
            total_carbon_tCO2=round(sum(t.carbon_tCO2 for t in trips), 3),
            trips=trips
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")

# Additional endpoints for integration with existing frontend
@app.get("/api/lanes")
def get_lanes():
    """Get available transportation lanes"""
    return [
        {
            "id": key,
            "origin": lane.origin,
            "destination": lane.dest,
            "distance_km": lane.distance_km,
            "vehicles": [{"mode": v.mode, "type": v.vehicle_type, "capacity": v.capacity_t} for v in lane.vehicles]
        }
        for key, lane in LANES.items()
    ]

@app.get("/api/plants")
def get_plants():
    """Get available plants for the frontend dropdowns"""
    origins = set()
    destinations = set()
    
    for lane in LANES.values():
        origins.add(lane.origin)
        destinations.add(lane.dest)
    
    return {
        "integrated_units": list(origins),
        "grinding_units": list(destinations)
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "solver": "SCIP", "currency": "INR"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)