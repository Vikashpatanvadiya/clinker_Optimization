import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate a professional PDF report of optimization results
 */
export const generateOptimizationPDF = (optimizationResult, data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const successColor = [16, 185, 129]; // Green
  const warningColor = [245, 158, 11]; // Orange
  const dangerColor = [239, 68, 68]; // Red
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Clinker Supply Chain', 14, 18);
  doc.setFontSize(16);
  doc.text('Optimization Report', 14, 28);
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 18, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Executive Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Executive Summary', 14, yPos);
  yPos += 10;
  
  // Summary metrics in boxes
  const summary = optimizationResult.summary;
  const metrics = [
    { label: 'Total Cost', value: `₹${summary.totalCost.toLocaleString()}`, color: successColor },
    { label: 'Fulfillment Rate', value: `${summary.fulfillmentRate.toFixed(1)}%`, color: primaryColor },
    { label: 'Total Demand', value: summary.totalDemand.toLocaleString(), color: warningColor },
    { label: 'Violations', value: optimizationResult.violations.length.toString(), color: optimizationResult.violations.length > 0 ? dangerColor : successColor }
  ];
  
  const boxWidth = (pageWidth - 28 - 15) / 4;
  metrics.forEach((metric, index) => {
    const x = 14 + (index * (boxWidth + 5));
    doc.setFillColor(...metric.color);
    doc.roundedRect(x, yPos, boxWidth, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.label, x + boxWidth/2, yPos + 8, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, x + boxWidth/2, yPos + 18, { align: 'center' });
  });
  
  yPos += 35;
  
  // Cost Breakdown
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Breakdown', 14, yPos);
  yPos += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const costData = [
    ['Production Cost', `₹${summary.productionCost.toLocaleString()}`],
    ['Transportation Cost', `₹${summary.transportationCost.toLocaleString()}`],
    ['Inventory Cost', `₹${(summary.inventoryCost || 0).toLocaleString()}`],
    ['Penalty Cost', `₹${(summary.penaltyCost || 0).toLocaleString()}`],
    ['Total Cost', `₹${summary.totalCost.toLocaleString()}`]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['Cost Component', 'Amount']],
    body: costData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth / 2 - 20
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Production Schedule
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Production Schedule', 14, yPos);
  yPos += 5;
  
  const productionData = optimizationResult.production.slice(0, 15).map(item => [
    item.iuCode,
    `T${item.period}`,
    item.quantity.toLocaleString(),
    `₹${item.cost.toLocaleString()}`,
    `₹${item.costPerUnit.toFixed(4)}`
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Plant', 'Period', 'Quantity', 'Cost', 'Cost/Unit']],
    body: productionData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 }
  });
  
  // New page for transportation
  doc.addPage();
  yPos = 20;
  
  // Transportation Schedule
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Transportation Schedule', 14, yPos);
  yPos += 5;
  
  const transportData = optimizationResult.transportation.slice(0, 20).map(item => [
    item.fromIU,
    item.toIugu,
    item.transport,
    `T${item.period}`,
    item.quantity.toLocaleString(),
    `₹${item.cost.toLocaleString()}`
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['From', 'To', 'Mode', 'Period', 'Quantity', 'Cost']],
    body: transportData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Violations (if any)
  if (optimizationResult.violations.length > 0) {
    doc.setTextColor(...dangerColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Constraint Violations (${optimizationResult.violations.length})`, 14, yPos);
    yPos += 5;
    
    const violationData = optimizationResult.violations.slice(0, 15).map(v => [
      v.type.replace(/_/g, ' '),
      v.iuguCode || v.iuCode || '-',
      `T${v.period}`,
      v.shortfall?.toLocaleString() || v.excess?.toLocaleString() || '-'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Type', 'Unit', 'Period', 'Amount']],
      body: violationData,
      theme: 'striped',
      headStyles: { fillColor: dangerColor },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 }
    });
  }
  
  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | Clinker Supply Chain Optimization System`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`clinker-optimization-report-${new Date().toISOString().split('T')[0]}.pdf`);
  
  return true;
};

export default generateOptimizationPDF;
