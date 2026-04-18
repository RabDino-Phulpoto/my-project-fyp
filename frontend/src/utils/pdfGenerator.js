// PDF generation utility for medical reports
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Convert image URL or blob to base64
 */
const imageToBase64 = async (imageSource) => {
  if (!imageSource) return null;

  // If already base64, return as-is
  if (typeof imageSource === "string" && imageSource.startsWith("data:image")) {
    return imageSource;
  }

  // If it's a blob or file, convert to base64
  if (imageSource instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    });
  }

  // If it's a URL, fetch and convert to base64
  if (typeof imageSource === "string") {
    try {
      const response = await fetch(imageSource);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn("Could not fetch image:", imageSource, error);
      return null;
    }
  }

  return null;
};

/**
 * Generate a comprehensive medical report PDF with patient info, analysis results, and images
 * @param {Object} patientInfo - Patient details (name, id, age, gender)
 * @param {Object} analysisResults - Analysis results (label, confidence, etc.)
 * @param {string} originalImageUrl - URL or base64 of original brain scan
 * @param {string} segmentedImageUrl - URL or base64 of segmented image (if available)
 */
export const generateReportPDF = async (patientInfo, analysisResults, originalImageUrl, segmentedImageUrl) => {
  try {
    // Convert images to base64
    const originalImageBase64 = await imageToBase64(originalImageUrl);
    const segmentedImageBase64 = await imageToBase64(segmentedImageUrl);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 15;

    // ==================== HEADER ====================
    pdf.setFillColor(30, 107, 179); // Primary blue
    pdf.rect(0, 0, pageWidth, 25, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text("IADS - Medical Report", pageWidth / 2, 10, { align: "center" });
    pdf.setFontSize(11);
    pdf.setFont(undefined, "normal");
    pdf.text("Intracranial Aneurysm Detection System", pageWidth / 2, 17, { align: "center" });
    pdf.setTextColor(0, 0, 0);

    yPosition = 35;

    // ==================== PATIENT INFORMATION ====================
    pdf.setFontSize(13);
    pdf.setFont(undefined, "bold");
    pdf.text("PATIENT INFORMATION", 15, yPosition);
    yPosition += 8;

    const patientTableData = [
      ["Patient Name", patientInfo.patientName || "N/A"],
      ["Patient ID", patientInfo.patientId || "N/A"],
      ["Age", patientInfo.age || "N/A"],
      ["Gender", patientInfo.gender || "N/A"],
      ["Report Date", new Date().toLocaleString()],
    ];

    pdf.autoTable({
      startY: yPosition,
      body: patientTableData,
      theme: "striped",
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold", fillColor: [240, 240, 240] },
        1: { cellWidth: 130 },
      },
      margin: { left: 15, right: 15 },
      didDrawPage: () => {},
    });

    yPosition = pdf.lastAutoTable.finalY + 10;

    // ==================== ANALYSIS RESULTS ====================
    pdf.setFontSize(13);
    pdf.setFont(undefined, "bold");
    pdf.text("ANALYSIS RESULTS", 15, yPosition);
    yPosition += 8;

    const isPositive = analysisResults.label === "Positive";
    const resultTableData = [
      ["Detection Result", analysisResults.label.toUpperCase()],
      ["Confidence Score", `${analysisResults.confidence?.toFixed(1) || 0}%`],
      ["Analysis Type", "AI-Assisted Classification"],
      ["Report Time", new Date().toLocaleString()],
    ];

    const resultBgColor = isPositive ? [255, 240, 240] : [240, 255, 240];
    const resultTextColor = isPositive ? [220, 38, 38] : [34, 197, 94];

    pdf.autoTable({
      startY: yPosition,
      body: resultTableData,
      theme: "striped",
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold", fillColor: [240, 240, 240] },
        1: { cellWidth: 130 },
      },
      margin: { left: 15, right: 15 },
    });

    yPosition = pdf.lastAutoTable.finalY + 10;

    // ==================== IMAGE DISPLAY - SIDE BY SIDE ====================
    if (originalImageBase64 || segmentedImageBase64) {
      pdf.setFontSize(13);
      pdf.setFont(undefined, "bold");
      pdf.text("SCAN IMAGES", 15, yPosition);
      yPosition += 8;

      const imageWidth = 75;
      const imageHeight = 75;
      const leftX = 15;
      const rightX = 110;
      const imageSpacing = 5;

      // Add original image
      if (originalImageBase64) {
        pdf.setFont(undefined, "bold");
        pdf.setFontSize(10);
        pdf.text("Original Scan", leftX, yPosition);
        yPosition += 3;

        try {
          pdf.addImage(
            originalImageBase64,
            "PNG",
            leftX,
            yPosition,
            imageWidth,
            imageHeight
          );
        } catch (error) {
          pdf.setFontSize(9);
          pdf.setTextColor(220, 38, 38);
          pdf.text("Image failed to load", leftX, yPosition + 35);
          pdf.setTextColor(0, 0, 0);
        }
      }

      // Add segmented image side by side (if positive)
      if (segmentedImageBase64 && isPositive) {
        pdf.setFont(undefined, "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Segmentation Result", rightX, yPosition);
        yPosition += 3;

        try {
          pdf.addImage(
            segmentedImageBase64,
            "PNG",
            rightX,
            yPosition,
            imageWidth,
            imageHeight
          );
        } catch (error) {
          pdf.setFontSize(9);
          pdf.setTextColor(220, 38, 38);
          pdf.text("Segmentation image failed", rightX, yPosition + 35);
          pdf.setTextColor(0, 0, 0);
        }
      }

      yPosition += imageHeight + 10;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 15;
    }

    // ==================== CLINICAL IMPRESSION ====================
    pdf.setFontSize(13);
    pdf.setFont(undefined, "bold");
    pdf.text("CLINICAL IMPRESSION", 15, yPosition);
    yPosition += 8;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(10);

    let clinicalText = "";
    if (isPositive) {
      clinicalText =
        `The AI analysis has detected a potential aneurysm in the provided brain scan with ` +
        `${analysisResults.confidence?.toFixed(1) || 0}% confidence. This finding requires immediate clinical ` +
        `review and correlation with imaging studies. Further diagnostic procedures and specialist ` +
        `consultation are strongly recommended.`;
    } else {
      clinicalText =
        `The AI analysis indicates no aneurysm detected in the provided brain scan with ` +
        `${analysisResults.confidence?.toFixed(1) || 0}% confidence. ` +
        `However, this finding should be correlated with clinical presentation and other diagnostic studies. ` +
        `Follow standard clinical protocols for patient management.`;
    }

    const splitText = pdf.splitTextToSize(clinicalText, 170);
    pdf.text(splitText, 15, yPosition);
    yPosition += splitText.length * 5 + 10;

    // ==================== RECOMMENDATIONS ====================
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 15;
    }

    pdf.setFontSize(13);
    pdf.setFont(undefined, "bold");
    pdf.text("RECOMMENDATIONS", 15, yPosition);
    yPosition += 8;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(10);

    const recommendations = isPositive
      ? [
          "1. Immediate neurology/neurosurgery consultation",
          "2. Advanced imaging (CTA, DSA) for confirmation",
          "3. Assessment for aneurysm characteristics and size",
          "4. Treatment planning and risk stratification",
          "5. Follow-up imaging and monitoring as per guidelines",
        ]
      : [
          "1. Continue standard clinical follow-up as per protocol",
          "2. Repeat imaging if clinically indicated",
          "3. Regular patient monitoring and clinical assessment",
          "4. Refer to specialist if new symptoms develop",
          "5. Maintain comprehensive medical records",
        ];

    recommendations.forEach((rec) => {
      pdf.text(rec, 20, yPosition);
      yPosition += 6;
    });

    // ==================== FOOTER ====================
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    
    const disclaimerText =
      "DISCLAIMER: This report is generated by an AI system (IADS) and must be reviewed and interpreted by a qualified medical professional. " +
      "AI findings should not replace clinical judgment and expert radiological interpretation. This document contains protected health information (PHI). " +
      "Unauthorized access or distribution is prohibited.";
    
    const footerY = pageHeight - 12;
    const splitDisclaimer = pdf.splitTextToSize(disclaimerText, 180);
    pdf.text(splitDisclaimer, pageWidth / 2, footerY - (splitDisclaimer.length - 1) * 2, {
      align: "center",
    });

    // Save the PDF
    const fileName = `IADS_Report_${patientInfo.patientId || "Unknown"}_${Date.now()}.pdf`;
    pdf.save(fileName);

    return {
      success: true,
      fileName,
      message: "Report downloaded successfully",
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Download a medical report as PDF
 * @param {Object} patientInfo - Patient info
 * @param {Object} analysisResults - Analysis results
 * @param {string} originalImage - Original scan image
 * @param {string} segmentedImage - Segmented image (if positive)
 */
export const downloadReportPDF = async (patientInfo, analysisResults, originalImage, segmentedImage) => {
  try {
    return await generateReportPDF(patientInfo, analysisResults, originalImage, segmentedImage);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};
