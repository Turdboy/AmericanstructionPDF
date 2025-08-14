import {  americonstructionLogo, accredits, roofXLogo, coverPlaceholderImage, americanstructionheader } from "../components/images";



import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export const countWords = (text: string) =>
  text?.trim().split(/\s+/).filter(Boolean).length || 0;


const chunkImages = (images, size = 2) => {
  const validImages = (images || []).filter(img => img && (img.base64 || img.url));
  const normalizedImages = validImages.map(img => ({
    ...img,
    base64: img.base64 || img.url, // use base64 if available, else fallback to url
  }));
  const chunks = [];
  for (let i = 0; i < normalizedImages.length; i += size) {
    chunks.push(normalizedImages.slice(i, i + size));
  }
  return chunks;
};

const colorTheme = {
  primary: "#2e3192",  // Blue background
  accent: "red",       // Red lines
  text: "white",       // White text (for headers/footer)
  neutral: "#000000"   // Black lines, if needed
};



const truncateText = (text = "", maxChars = 500) => {
  if (typeof text !== "string") return "";

  if (text.length > maxChars) {
    alert("❗ Text too long. Please re-enter under 250 characters.");
    return ""; // return nothing or original text if you prefer
  }

  return text;
};





const isImageTextTooLong = (image) => {
  if (!image) return false;
  const fields = [
    image.section,
    image.area,
    image.caption,
    image.description,
    image.cause,
    image.impact,
    image.solution
  ]
    .filter(Boolean)
    .join(" ");

  return fields.length > 400; // ← adjust this threshold as needed
};

const splitLongImageText = (image, threshold = 400) => {
  const lines = [
    image.section && "Section: " + image.section,
    image.area && "Area: " + image.area,
    image.caption && "Caption: " + image.caption,
    image.description && "Description: " + image.description,
    image.cause && "Cause: " + image.cause,
    image.impact && "Impact: " + image.impact,
    image.solution && "Solution: " + image.solution,
  ].filter(Boolean);

  let currentLength = 0;
  const firstHalf = [];
  const secondHalf = [];

  for (const line of lines) {
    if (currentLength + line.length <= threshold) {
      firstHalf.push(line);
      currentLength += line.length;
    } else {
      secondHalf.push(line);
    }
  }

  return { firstHalf, secondHalf };
};



const handleSectionChange = (index, updatedSection) => {
  const updatedSections = [...formData.roofSections];
  updatedSections[index] = updatedSection;
  setFormData({ ...formData, roofSections: updatedSections });
};



const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const handleUpload = async (file) => {
  const base64 = await toBase64(file);

  const baseImage = {
    base64,
    section: "A",
    area: "North",
    caption: "Roof Area",
    description: "Some issue",
    cause: "Weather",
    impact: "Leakage",
    solution: "Patch"
  };

  // 👇 VERY IMPORTANT: Spread into new object each time
  setOverviewImages(prev => [...prev, { ...baseImage }]);
  setDroneImages(prev => [...prev, { ...baseImage }]);
  setImages(prev => [...prev, { ...baseImage }]); // defect pics
};


const createStandardHeader = (titleText = "") => ([
  {
    canvas: [
      { type: "rect", x: -150, y: 0, w: 595, h: 2, color: "red" }
    ]
  },
  {
    canvas: [
      { type: "rect", x: -150, y: 2, w: 595, h: 76, color: "#2e3192" }
    ]
  },
  {
    canvas: [
      { type: "rect", x: -150, y: 2, w: 595, h: 2, color: "red" }
    ]
  },
  {
    columns: [
      {
        text: titleText,
        bold: true,
        fontSize: 24,
        color: "white",
        margin: [40, -60, 0, 30]
      },
      {
        image: americanstructionheader,
        width: 150,
        alignment: "right",
        margin: [70, -70, 0, 30]
      }
    ]
  }
]);


const createFooter = (pageNumber) => {
  return [
    {
      canvas: [
        { type: "rect", x: 0, y: 0, w: 595, h: 5, color: "red" },
        { type: "rect", x: 0, y: 5, w: 595, h: 65, color: "#2e3192" }
      ],
      absolutePosition: { x: 0, y: 755 }
    },
    {
      columns: [
        { text: "", width: "*" },
        {
          text: `Page ${pageNumber}`,
          fontSize: 10,
          alignment: "right",
          margin: [0, 10, 40, 0],
          color: "white"
        }
      ],
      absolutePosition: { x: 0, y: 760 }
    }
  ];
};



export const prepareImages = async (images: any[]) => {
  return await Promise.all(
    images.map(async (img) => {
      if (img.base64) return img;

      const response = await fetch(img.url);
      const blob = await response.blob();
      const reader = new FileReader();

      return await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve({
            ...img,
            base64: reader.result,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
  );
};



async function appendAdditionalPDFs(mainPdfBytes: Uint8Array, urls: string[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.load(mainPdfBytes);

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const newPdf = await PDFDocument.load(data);
      const copiedPages = await mergedPdf.copyPages(newPdf, newPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (error) {
      console.error(`❌ Failed to append PDF from ${url}:`, error);
    }
  }

  return await mergedPdf.save();
}






// === PDF Generator Function ===
export const generatePDF = (formData) => {


  
  


    console.log("Generating PDF with data:", formData);
    const firstDroneImage = formData.droneImages?.[0]?.base64 || coverPlaceholderImage;
    const imagePages = chunkImages(formData.images || []);
    const overviewPages = chunkImages(formData.overviewImages || []);
    const droneImages = chunkImages(formData.droneImages || []);






const safeText = (val) => ({ text: val !== undefined && val !== null ? String(val) : "N/A" });









// ======== PAGE 1: SECTION SUMMARY (PART 1) ========
const createSectionPageOne = (sectionNumber, sectionData = {}, pageNumber) => ({
  pageBreak: "before",
  stack: [
    ...createStandardHeader(`Section ${sectionNumber} Summary`),

    {
      text: "General Observations",
      style: "subheader"
    },
    ...[
      ["Overall Roof Condition", "overallCondition"],
      ["Leaks/Water Damage", "leaks"],
      ["Description", "leaksDescription"],
      ["Debris Accumulation", "debrisAccumulation"],
      ["Description", "debrisDescription"],
      ["Vegetation Growth", "vegetationGrowth"],
      ["Description", "vegetationDescription"],
      ["Accessibility Issues", "accessibilityIssues"],
      ["Description", "accessibilityDescription"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Interior Evaluation",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Underside Accessible", "undersideAccessible"],
      ["Moisture Damage", "deckMoisture"],
      ["Description", "deckMoistureDescription"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Roofing Membrane / Surface",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Membrane Material", "membraneMaterial"],
      ["Condition", "membraneCondition"],
      ["Seams/Overlaps", "seamsCondition"],
      ["Coating", "coatingCondition"],
      ["Differences in Firmness", "insulationFirmness"],
      ["Description", "insulationFirmnessDescription"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

        {
      text: "Flashing & Sealants",
      style: "subheader"
    },
    ...[
      ["Material", "flashingMaterial"],
      ["Condition", "flashingCondition"],
      ["Locations", "flashingLocations"],
      ["Note", "flashingNotes"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

...createFooter(pageNumber)


  ]
});


// ======== PAGE 2: SECTION SUMMARY (PART 2) ========
const createSectionPageTwo = (sectionNumber, sectionData = {}, pageNumber) => ({
  pageBreak: "before",
  stack: [
    ...createStandardHeader(`Section ${sectionNumber} Overview`),



    {
      text: "Drainage System",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Gutters", "guttersCondition"],
      ["Gutter Size", "gutterSize"],
      ["Downspouts", "downspoutsCondition"],
      ["Downspout Size", "downspoutsSize"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Penetrations & Vents",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Pipes", "pipesCondition"],
      ["# of Pipes", "pipesCount"],
      ["Vents", "ventsCondition"],
      ["# of Vents", "ventsCount"],
      ["HVAC Units", "hvacCondition"],
      ["# of Units", "hvacCount"],
      ["Chimneys", "chimneysCondition"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Parapet Walls",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Wall Condition", "parapetWallCondition"],
      ["Coping Condition", "copingCondition"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Deck / Structure",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    ...[
      ["Evidence of Structural Issues", "structuralIssues"],
      ["Details", "structuralIssueDetails"]
    ].map(([label, key]) => ({
      text: `${label}: ${sectionData?.[key] || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    })),

    {
      text: "Safety",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    {
      text: `Roof Access: ${sectionData?.safeAccess || "N/A"}`,
      fontSize: 10,
      margin: [0, 0, 0, 2]
    },

    {
      text: "Roof Square Footage",
      style: "subheader",
      margin: [0, 10, 0, 5]
    },
    {
      text: `Length: ${sectionData?.roofLength || "N/A"} ft\nWidth: ${sectionData?.roofWidth || "N/A"} ft\nTotal: ${(sectionData?.roofLength * sectionData?.roofWidth) || "N/A"} SF`,
      fontSize: 10,
      margin: [0, 0, 0, 10]
    },

...createFooter(pageNumber)

  ]
});
  






// =================================== START OF PROGRAM (NO MORE ROOF CONDITION SUMMARY) ==============================













console.log("🧠 formData.roofSections = ", formData.roofSections);


if (!Array.isArray(formData.roofSections) || formData.roofSections.length === 0) {
  throw new Error("Missing or invalid roofSections array");
}
const roofSections = Array.isArray(formData.roofSections) ? formData.roofSections : [];

  








    const docDefinition = {
      footer: function(currentPage, pageCount) {
  return createFooter(currentPage);
},

        content: [

            // =================== Cover Page Header ===================
            {
                stack: [

                    // Decorative Top Black Line
                    {
                        canvas: [
                            { type: "rect", x: 0, y: 0, w: 595, h: 2, color: "red"}
                        ]
                    },

                    // Red Header Background
                    {
                        canvas: [
                            { type: "rect", x: 0, y: 2, w: 595, h: 76, color: "#2e3192"}
                        ]
                    },

                    // Bottom Line Under Header
                    {
                        canvas: [
                            { type: "rect", x: 0, y: 2, w: 595, h: 2, color: "red"}
                        ]
                    },

                    // Logo and Title Text
                    {
                        columns: [
                            {
                                image: americonstructionLogo,
                                width: 200,
                                margin: [20, 15, 0, 10]
                            },
                            {
                                stack: [
                                    { text: "Roof Assessment and", style: "title", alignment: "right", color: "white" },
                                    { text: "Proposed Solution", style: "title", alignment: "right", color: "white" }
                                ],
                                margin: [0, 30, 20, 0]
                            }
                        ],
                        absolutePosition: { x: 0, y: 23 }
                    }
                ]
            },

            // =================== Cover Visual Section ===================

            // Top Black Line Spacer
            {
                canvas: [
                    { type: "rect", x: -70, y: 0, w: 635, h: 2, color: "black"}
                ],
                margin: [0, 40, 0, 0]
            },

            // Center Image
            {
                image: firstDroneImage,
                height: 220,
                width: 400,
                alignment: "center",
                margin: [0, 20, 0, 20]
            },

            // Bottom black line
            {
            canvas: [
              { type: "rect", x: -70, y: 0, w: 635, h: 2, color: "black"}
                    ],
              margin: [0, 0, 0, 10] // Space before address
             },





  
              // Property Address as main title (below the black line)
              {
                text: formData.propertyAddress || "Property Address Here",
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                  margin: [0, 10, 0, 20] // Vertical spacing
              },




                
              
              
              
              
              
  // Red Footer Banner (mirrored header style)
              {
                stack: [
      // Top black line (above red bar)
                      {
        canvas: [
          {
            type: "rect",
            x: -150,
            y: 0,
            w: 595, // 595 + 2*150 to cover full page shift
            h: 2,
            color: "red"
                }
        ]
                  },
  
      // Red bar background
                  {
        canvas: [
          {
            type: "rect",
            x: -150,
            y: 2, // after top black line
            w: 595,
            h: 76,
            color: "#2e3192"
          }
        ]
                },
  
      // Bottom black line (after red bar)
                {
        canvas: [
          {
            type: "rect",
            x: -150,
            y: 2, // after red bar
            w: 595,
            h: 2,
            color: "red"
          }
        ]
                },
  
      // Text left + Logo right (centered in red bar)
                {   
        columns: [
          {
            stack: [
              { text: "PDF Generated by", style: "footerTitle", color: "white" }
            ],
            margin: [150, 15, 10, 10]
          },
          {
            image: roofXLogo,
            width: 100,
            alignment: "right",
            margin: [120, -11, 0, 10]
          }
        ],
        absolutePosition: { x: 0, y: 534 } // position within red bar
        
              },
              {
                stack: [
                {
                  canvas: [
                    // Black top curved border (simulate curve using angled rectangle)
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: 595,
                      h: 5,
                      color: "red"
                    },
                    // Red fill background
                    {
                      type: "rect",
                      x: 0,
                      y: 5,
                      w: 595,
                      h: 65,
                      color: "#2e3192"
                    }
                  ],
                  absolutePosition: { x: 0, y: 755 } // Adjust y if needed
                },
                {
                  columns: [
                    { text: "", width: "*" }, // Spacer
                    {
                      text: "Page 1",
                      fontSize: 10,
                      alignment: "right",
                      margin: [0, 10, 40, 0],
                      color: "white"
                    }
                  ],
                  absolutePosition: { x: 0, y: 760 }
                }
              ]

              }
    ],
    margin: [0, 30, 0, 0]
  },
  {
    stack: [
      



      { text: "Thank you for choosing Americanstruction", fontSize: 20, italics: true, bold: true, margin: [0, 2, 0, 0] }
    ],
    margin: [10, 60, 0, 0]
  },  
  ...createFooter(1),

  
  // Add this to your PDF content array where you want the Pricing Notice to appear
  



















  // ============================== Page 2


  {
    pageBreak: "before",
    stack: [
      // Top red line
      {
        canvas: [{ type: "rect", x: 50, y: 0, w: 400, h: 2, color: "red" }]
      },
  
      // Blue rectangle background
      {
        canvas: [{ type: "rect", x: 50, y: 2, w: 400, h: 400, color: "#2e3192" }]
      },
  
      // Bottom red line
      {
        canvas: [{ type: "rect", x: 50, y: 2, w: 400, h: 2, color: "red" }]
      },
  
      // Table of Contents Text
      {
        absolutePosition: { x: 100, y: 100 },
        stack: [
          {
            text: "Table of Contents",
            fontSize: 22,
            bold: true,
            color: "white",
            margin: [0, 0, 0, 25]
          },
          {
            columns: [
              { text: "Name                                                                                  Section", bold: true, color: "white", fontSize: 13, width: 370 },
              { text: "Section", bold: true, color: "white", fontSize: 13, alignment: "right" }
            ],
            margin: [0, 0, 0, 15]
          },
          {
            columns: [
              { text: "Pricing Notice..........................................................................................................1", color: "white", fontSize: 11 },
              { text: "1", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Prepared For & By.................................................................................................................2", color: "white", fontSize: 11 },
              { text: "2", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Letter of Introduction................................................................................................3", color: "white", fontSize: 11 },
              { text: "3", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Overview Photos.........................................................................................................4", color: "white", fontSize: 11 },
              { text: "4", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Overview Drone Photos.........................................................................................................5", color: "white", fontSize: 11 },
              { text: "5", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Defect Photos.........................................................................................................6", color: "white", fontSize: 11 },
              { text: "6", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          },
          {
            columns: [
              { text: "Roof Condition Summaries..................................................................................................7", color: "white", fontSize: 11 },
              { text: "7", color: "white", fontSize: 11, alignment: "right" }
            ],
            margin: [0, 0, 0, 8]
          }
        ]
      },
  
        ...createFooter(2),
    ],
    margin: [0, 30, 0, 0]
  },
  {
    image: americanstructionheader,
    width: 150,
    alignment: "right",
    margin: [100, -395, 0, 0]
  },
  




   // =================== Page 4===================
  

            // =================== Property + Inspector Info ===================
            {
                pageBreak: "before",
                stack: [
                  
                  {
                    stack: [
                      // Top black line (above red bar)
                      {
                        canvas: [
                          {
                            type: "rect",
                            x: -150,
                            y: 0,
                            w: 1000,  // 595 + 2*150 to cover full page shift
                            h: 2,
                            color: "red"
                          }
                        ]
                      },
                  
                      // Red bar background
                      {
                        canvas: [
                          {
                            type: "rect",
                            x: -150,
                            y: 2, // after top black line
                            w: 1000,
                            h: 200,
                            color: "#2e3192"
                          }
                        ]
                      },
                  
                      // Bottom black line (after red bar)
                      {
                        canvas: [
                          {
                            type: "rect",
                            x: -150,
                            y: 2, // after red bar
                            w: 1000,
                            h: 2,
                            color: "red"
                          }
                        ]
                      },

                      {
                        canvas: [
                          {
                            type: "line",
                            x1: 297.5,
                            y1: 300,
                            x2: 297.5,
                            y2: 602, // 202 + 80px downward
                            lineWidth: 2,
                            lineColor: "black"
                          }
                        ],
                        absolutePosition: { x: 0, y: 0 } // canvas works in absolute terms here
                      },
                      
                  
                      // Text left + Logo right (centered in red bar)
                      {
                        columns: [
                          {
                            image: americonstructionLogo,
                            width: 250,
                            margin: [20, -420, 0, 10]
                        },

                        
                          {
                            stack: [
                              { text: "Proudly Serving the \n Chicagoland Area with \n Top-Rated General \n Contracting Services. \n\n for more, visit www.americanstruction.com"
                                , style: "footerTitle", color: "white"}
                            ],
                            margin: [50, -420, 10 ,10 ]
                          },
                        
                        
                        ],
                        absolutePosition: { x: 0, y: 534 } // position within red bar
                      }
                    ],
                    margin: [0, 30, 0, 0]
                  },


                    // Address
                    {
                      
                      columns: [
                        {
                          width: "45%",
                          stack: [
                            { text: "Prepared for:", bold: true, fontSize: 14, margin: [0, 0, 0, 10] },
                      
                            { text: "Client Name:", bold: true },
                            { text: formData.clientname || "______________", margin: [0, 0, 0, 10] },
                      
                            { text: "Client Contact Info:", bold: true },
{ text: formData.clientcontactinfo || "______________", margin: [0, 0, 0, 10] },

                      
                            { text: "Property Name:", bold: true },
                            { text: formData.propertyName || "______________", margin: [0, 0, 0, 10] },
                      
                            { text: "Property Address:", bold: true },
                            { text: formData.propertyAddress || "______________", margin: [0, 0, 0, 10] },
                      
                            { text: "Inspection Date:", bold: true },
                            { text: formData.inspectionDate || "______________", margin: [0, 0, 0, 10] },
                      
                            {
                              text: "Report Generated On: " + new Date().toLocaleDateString(),
                              italics: true,
                              alignment: "left",
                            }
                            
                          ],
                          margin: [0, 30, 0, 0]
                        },
                        {
                          width: "55%",
                          stack: [
                            {
                              text: "Prepared by:",
                              bold: true,
                              fontSize: 14,
                              margin: [0, 0, 0, 10]
                            },
                      
                            { text: "Inspector Name:", bold: true },
                            { text: formData.inspectorName || "______________", margin: [0, 0, 0, 10] },
                      
                            { text: "Inspector Company:", bold: true },
                            { text: formData.inspectorCompany || "______________", margin: [0, 0, 0, 10] },
                      
                            { text: "Inspector Contact Info:", bold: true },
{ text: formData.inspectorcontactinfo || "______________", margin: [0, 0, 0, 10] }

                          ],
                          margin: [60, 30, 0, 0]
                        }
                      ]
                      
                    },

                   ...createFooter(3),
                    
                    
                    
                    
                    
                    
                ],
            },
            {
              image: accredits,
              width: 250,
              alignment: "right",
              margin: [-15, -80, 0, 0]
            },




            
            
            
             // =================== Page 4 ===================

{
  pageBreak: "before",
  stack: [

    // === Red/Blue Header ===
    {
      canvas: [
        {
          type: "rect",
          x: -150,
          y: 0,
          w: 595,
          h: 2,
          color: "red"
        }
      ]
    },
    {
      canvas: [
        {
          type: "rect",
          x: -150,
          y: 2,
          w: 595,
          h: 76,
          color: "#2e3192"
        }
      ]
    },
    {
      canvas: [
        {
          type: "rect",
          x: -150,
          y: 2,
          w: 595,
          h: 2,
          color: "red"
        }
      ]
    },

    // === Letter of Introduction Text ===
    {
      margin: [40, 20, 40, 0],
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: 'Letter of Introduction',
              bold: true,
              fontSize: 24,
              color: 'white',
              margin: [40, -80, 0, 0]
            }
          ],
          [
            {
               text:
            "Dear Home Enthusiast,\n\n" +
            "At Americanstruction, our core values—Resilience, Integrity, Solidarity, and Excellence (R.I.S.E.)—guide every shingle we lay and every customer we serve. As a proud woman-owned company, we champion empowerment and extend that spirit of confidence to homeowners, helping you make informed, confident decisions for your home and family.\n\n" +
            "Choosing a new roof is a big decision. From cost to durability and curb appeal, we understand your concerns. Our journey from a small provider to Chicagoland’s trusted name in residential roofing speaks to our deep-rooted values. We’re here to educate and guide you through the process—from material selection to final installation—so you always know what’s happening without stepping foot on your roof.\n\n" +
            "We use cutting-edge tools to manage your project with precision. Each photo is organized and geo-tagged for clarity. With HOVER, we create accurate 3D models of your home, and EagleView aerial imagery enhances our measurement precision. These technologies save time and increase accuracy so we can focus more on your needs.\n\n" +
            "As certified GAF and Owens Corning installers, we meet rigorous standards of workmanship and satisfaction. Our preferred contractor status holds us accountable to the highest standards and ensures you receive modern, reliable roofing solutions.\n\n" +
            "Empowerment is our foundation. Just as we champion women in leadership, we empower you with information and options. We combine traditional values with modern tools to help you protect and enhance your home.\n\n" +
            "Choose a contractor rooted in the community, committed to environmental care, and dedicated to building roofs that are as strong as they are beautiful. Whether you're interested in shingles, metal roofing, or just need an honest inspection—Americanstruction is here.\n\n" +
            "Contact us today for a free estimate and inspection.\n\n" +
            "We look forward to helping with your roofing needs,\n\n" +
            "Pamela DeGregorio\nFounder, Americanstruction\n\n" +
            "Michael DeGregorio\nCo-Founder, Americanstruction",
fontSize: 8,
lineHeight: 1.5,
margin: [0, 0, 0, 10]

            }
          ]
        ]
      },
      layout: 'noBorders'
    },

    ...createFooter(4),
  ]
},
{
  image: americanstructionheader,
  width: 150,
  alignment: "right",
  margin: [50, -600, 0, 0]
},

            
            



            
        ],
        styles: {
          title: {
              fontSize: 22,
              bold: true,
              color: "white",
              margin: [10, 0, 10, 0]
          },
          header: {
              fontSize: 22,
              bold: true,
              margin: [0, 10]
          },
          subheader: {
              fontSize: 16,
              bold: true,
              margin: [0, 10]
          },
          footerTitle: {
              fontSize: 16,
              bold: true,
              margin: [0, 2]
          },
          
      }
  };











//============= Loop for roof sections !!!!!!




const basePageOffset = 4; // 4 static + 1 roof summary
const roofSectionPages = roofSections.length * 2;

const overviewBaseOffset = basePageOffset + roofSectionPages;
const droneBaseOffset = overviewBaseOffset + overviewPages.length;
const defectBaseOffset = droneBaseOffset + droneImages.length;










if (formData.pdfToggles?.roofSections) {


roofSections.forEach((section, index) => {







  
  const pageStart = basePageOffset + index * 2;

  const pages = [
    createSectionPageOne(index + 1, section, pageStart + 1),
    createSectionPageTwo(index + 1, section, pageStart + 2),
  ];

  docDefinition.content.push(...pages);
});




}










const finalPageNumber = defectBaseOffset + imagePages.length ; // +1 for final pricing or contract page


 






















// overview picutures infinite 



if (formData.pdfToggles?.dronePhotos) {

overviewPages.forEach((pair, index) => {
  try {
    if (!Array.isArray(pair)) {
  console.warn("Skipping invalid defect image pair:", pair);
  return;
}

    

    const image1 = pair[0]?.base64 ? pair[0] : null;
    const image2 = pair[1]?.base64 ? pair[1] : null;

  docDefinition.content.push({
    pageBreak: "before",
    stack: [

      // Header
      ...createStandardHeader("Overview Pictures"),

      // Vertical Line
      {
        canvas: [
          {
            type: "line",
            x1: 297.5,
            y1: 130,
            x2: 297.5,
            y2: 700,
            lineWidth: 2,
            lineColor: "black"
          }
        ],
        absolutePosition: { x: 0, y: 0 }
      },

      
      {
        columns: [
          {
            width: "48%",
            margin: [0, 20, 10, 0],
            stack: image1
              ? [
                  {
                    image: image1?.base64 || placeholderImage,
                    width: 250,
                    fit: [250, 150],
                    margin: [0, 0, 0, 8]
                  },
                  {
                    stack: [
  {
    ul: [
      image1.note && { text: truncateText("Note: " + image1.note) },
      image1.section && { text: truncateText("Section: " + image1.section) },
      image1.area && { text: truncateText("Area: " + image1.area) },
      image1.caption && { text: truncateText("Caption: " + image1.caption) },
      image1.description && { text: truncateText("Description: " + image1.description) },
      image1.cause && { text: truncateText("Cause: " + image1.cause) },
      image1.impact && { text: truncateText("Impact: " + image1.impact) },
      image1.solution && { text: truncateText("Solution: " + image1.solution) }
    ].filter(Boolean),
    fontSize: 9
  },
  image1.customNote && {
    text: "Inspector Notes: " + truncateText(image1.customNote),
    fontSize: 9,
    margin: [0, 6, 0, 0]
  }
]
,
                    height: 150,
                    overflow: "shrink"
                    
                  }
                ]
              : []
          },
          { width: "4%", text: "" },
          {
            width: "48%",
            margin: [10, 20, 0, 0],
            stack: image2
              ? [
                  {
                    image: image2?.base64 || placeholderImage,                    fit: [250, 150],
                    alignment: "center",
                    margin: [0, 0, 0, 8]
                  },
                  {
                    stack: [
                      {
                        ul: [
                          image2.section && { text: truncateText("Section: " + image2.section) },
                          image2.area && { text: truncateText("Area: " + image2.area) },
                          image2.caption && { text: truncateText("Caption: " + image2.caption) },
                          image2.description && { text: truncateText("Description: " + image2.description) },
                          image2.cause && { text: truncateText("Cause: " + image2.cause) },
                          image2.impact && { text: truncateText("Impact: " + image2.impact) },
                          image2.solution && { text: truncateText("Solution: " + image2.solution) }
                        ].filter(Boolean),
                        fontSize: 9
                      }
                    ],
                    height: 150,
                    overflow: "shrink"
                    
                  }
                ]
              : []
          }
        ]
      },
     createFooter(overviewBaseOffset + index+1)

    ]
  });

} catch (err) {
  console.error("Error rendering overview pair", index, pair, err);
}
});


    

}



 if (formData.pdfToggles?.overviewPhotos) {






// ======= Overview Drone pictures 



droneImages.forEach((pair, index) => {
  try {
    if (!Array.isArray(pair)) {
      console.warn("Skipping invalid drone image pair:", pair);
      return;
    }

    const image1 = pair[0]?.base64 ? pair[0] : null;
    const image2 = pair[1]?.base64 ? pair[1] : null;

    docDefinition.content.push({
      pageBreak: "before",
      stack: [
        // Header
      ...createStandardHeader("Overview Drone Pictures"),

        // Vertical Line to separate image columns
        {
          canvas: [
            {
              type: "line",
              x1: 297.5,
              y1: 130,
              x2: 297.5,
              y2: 700,
              lineWidth: 2,
              lineColor: "black"
            }
          ],
          absolutePosition: { x: 0, y: 0 }
        },

        // Image Columns
        {
          columns: [
            {
              width: "48%",
              margin: [0, 20, 10, 0],
              stack: image1
                ? [
                    {
                      image: image1?.base64 || placeholderImage,
                      fit: [250, 150],
                      alignment: "center",
                      margin: [0, 0, 0, 8]
                    },
                    {
                      stack: [
  {
    ul: [
      image1.note && { text: truncateText("Note: " + image1.note) },
      image1.section && { text: truncateText("Section: " + image1.section) },
      image1.area && { text: truncateText("Area: " + image1.area) },
      image1.caption && { text: truncateText("Caption: " + image1.caption) },
      image1.description && { text: truncateText("Description: " + image1.description) },
      image1.cause && { text: truncateText("Cause: " + image1.cause) },
      image1.impact && { text: truncateText("Impact: " + image1.impact) },
      image1.solution && { text: truncateText("Solution: " + image1.solution) }
    ].filter(Boolean),
    fontSize: 9
  },
  image1.customNote && {
    text: "Inspector Notes: " + truncateText(image1.customNote),
    fontSize: 9,
    margin: [0, 6, 0, 0]
  }
]
,
                      height: 150,
                      overflow: "shrink"
                      
                    }
                  ]
                : []
            },
            { width: "4%", text: "" },
            {
              width: "48%",
              margin: [10, 20, 0, 0],
              stack: image2
                ? [
                    {
                      image: image2?.base64 || placeholderImage,
                      fit: [250, 150],
                      alignment: "center",
                      margin: [0, 0, 0, 8]
                    },
                    {
                      stack: [
                        {
                          ul: [
                            image2.section && { text: truncateText("Section: " + image2.section) },
                            image2.area && { text: truncateText("Area: " + image2.area) },
                            image2.caption && { text: truncateText("Caption: " + image2.caption) },
                            image2.description && { text: truncateText("Description: " + image2.description) },
                            image2.cause && { text: truncateText("Cause: " + image2.cause) },
                            image2.impact && { text: truncateText("Impact: " + image2.impact) },
                            image2.solution && { text: truncateText("Solution: " + image2.solution) }
                          ].filter(Boolean),
                          fontSize: 9
                        }
                      ],
                      height: 150,
                      overflow: "shrink"
                      
                    }
                  ]
                : []
            }
          ]
        },

        createFooter(droneBaseOffset + index+1)
      ]
    });
  } catch (err) {
    console.error("Error rendering drone overview pair", index, pair, err);
  }
});




}
















 // === Defect Picture Infinite Page Creator ===


if (formData.pdfToggles?.defectPhotos) {

// ======= Defect Pictures Infinite Page Creator =======

imagePages.forEach((pair, index) => {
  try {
    if (!Array.isArray(pair)) {
      console.warn("Skipping invalid defect image pair:", pair);
      return;
    }
    
  

    const image1 = pair[0]?.base64 ? pair[0] : null;
    const image2 = pair[1]?.base64 ? pair[1] : null;
    

  docDefinition.content.push({
    pageBreak: "before",
    stack: [
      // Header
      ...createStandardHeader("Defect Pictures"),

      // Vertical Line
      {
        canvas: [
          {
            type: "line",
            x1: 297.5,
            y1: 130,
            x2: 297.5,
            y2: 700,
            lineWidth: 2,
            lineColor: "black"
          }
        ],
        absolutePosition: { x: 0, y: 0 }
      },

      // Image Columns
      {
        columns: [
          {
            width: "48%",
            margin: [0, 20, 10, 0],
            stack: image1
              ? [
                  {
                    image: image1?.base64 || placeholderImage,
fit: [250, 150],
alignment: "center",
margin: [0, 0, 0, 8]
                  },
                  {
                    stack: [
  {
    ul: [
      image1.note && { text: truncateText("Note: " + image1.note) },
      image1.section && { text: "Section: " + image1.section },
      image1.area && { text: "Area: " + image1.area },
      image1.caption && { text: "Caption: " + image1.caption },
      image1.description && { text: "Description: " + image1.description },
      image1.cause && { text: "Cause: " + image1.cause },
      image1.impact && { text: "Impact: " + image1.impact },
      image1.solution && { text: "Solution: " + image1.solution }
    ].filter(Boolean),
    fontSize: 9,
  },
  image1.customNote && {
    text: "Inspector Notes: " + truncateText(image1.customNote),
    fontSize: 9,
    margin: [0, 6, 0, 0]
  }
]
,
                    height: 150,           // ⚠️ this caps the box
                    overflow: "shrink",    // ⚠️ font shrinks to fit, no overflow
                  }
                  
                ]
              : []
          },
          { width: "4%", text: "" },
          {
            width: "48%",
            margin: [10, 20, 0, 0],
            stack: image2
              ? [
                  {
                    image: image2?.base64 || placeholderImage,
                    fit: [250, 150],
                    alignment: "center",
                    margin: [0, 0, 0, 8]
                  },
                  {
                    ul: [
                      image2.section && { text: "Section: " + image2.section },
                      image2.area && { text: "Area: " + image2.area },
                      image2.caption && { text: "Caption: " + image2.caption },
                      image2.description && { text: "Description: " + image2.description },
                      image2.cause && { text: "Cause: " + image2.cause },
                      image2.impact && { text: "Impact: " + image2.impact },
                      image2.solution && { text: "Solution: " + image2.solution }
                    ].filter(Boolean),
                    fontSize: 9
                  }
                ]
              : []
          }
        ]
      },

      createFooter(defectBaseOffset + index +1)

    ]
  });


  





  }
   catch (err) {
    console.error("Error rendering defect picture pair", index, pair, err);
  }
});













}



































// ================= SCOPE OF WORK PAGE =================
if (formData?.pdfToggles?.scopeOfWork) {
  docDefinition.content.push({
    pageBreak: "before",
    stack: [
      ...createStandardHeader("Scope of Work"),

      {
        text: "* This summary was written by the inspector based on observations and recommendations made during the inspection.",
        italics: true,
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },
      {
        text: formData.selectedScopeText?.trim() || "No detailed scope was selected or edited.",
        fontSize: 10,
        lineHeight: 1.4,
      },
      {
        absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
        stack: [
          {
            text: formData.clientInitials || "",
            fontSize: 11,
            bold: true,
            italics: true,
            alignment: "left",
            margin: [20, 0, 0, 2], // spacing above line
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 60,  // line length
                y2: 0,
                lineWidth: 1.5, // ✅ bolder line
              }
            ],
          },
        ],
      },

      ...createFooter(finalPageNumber + 1)
    ]
  });
} else {
  console.log("⏭ Skipping Scope of Work page — toggle is OFF");
}




































//Contract PAGE ONE !!!!!!!!!!!!!!!!!!!!


if (formData.pdfToggles?.contract) {
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Contract"),

    {
      text: "CONSTRUCTION CONTRACT AGREEMENT",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 10]
    },
    {
      text:
        "Effective Date: ____________________\n\n" +
        "This Contract (the “Contract”) is entered into as of the Effective Date,\n\nBETWEEN:\nAMERICANSTRUCTION INC.\n19222 S LaGrange Rd., Mokena, Illinois, 60448\n(the “Contractor”)\n\nAND:\n{{CUSTOMER_NAME}}\n{{CUSTOMER_ADDRESS}}\n(the “Owner”)\n\nIf more than one Owner, this refers to all listed above.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },
    {
      text: "Table of Contents",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      ul: [
        "Agreement and Work Performance",
        "Scope of Work",
        "Location",
        "Price and Payment Schedule",
        "Materials",
        "Compliance with Laws and Design Defects",
        "Contract Changes (Change Orders)"
      ],
      fontSize: 8
    },

    {
      ul: [
        "Coordination and Delays",
        "Failure to Complete Work",
        "Failure to Pay Contractor",
        "Insurance",
        "Ownership of Materials",
        "Care of Property",
        "Permits",
        "Notices"
      ],
      fontSize: 8,
      margin: [0, 30, 0, 10]
    },
    {
      ul: [
        "Parties Bound",
        "Retainage",
        "Payment to Subcontractors (\"Pay When Paid\" Clause)",
        "Termination for Convenience",
        "Notice to Owner",
        "Signatures"
      ],
      fontSize: 8
    },
    {
      text: "1. Agreement and Work Performance",
      bold: true,
      fontSize: 10,
      margin: [0, 20, 0, 5]
    },
    {
      text:
        "The Contractor agrees to perform construction or repair work (“Work”) per this Contract. All Work shall be performed in a good, sound, workmanlike manner. The Contractor shall begin no later than the date in Schedule A.",
      fontSize: 8
    },

    {
      text: "2. Scope of Work",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Work is defined in Schedule A, which is incorporated into this Contract by reference.",
      fontSize: 8
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

   ...createFooter(finalPageNumber + 2)
  ]
});




//Contract 3

docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Contract"),

    {
      text: "3. Location",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 5]
    },
    {
      text: "Work shall be performed at: {{CUSTOMER_ADDRESS}}",
      fontSize: 8
    },

    {
      text: "4. Price and Payment Schedule",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Total contract price: [PRICE]\n\nTo be paid in 3 parts:\n1/3 upon signing\n1/3 on material drop\n1/3 on substantial completion\n\nIncludes labor, materials, taxes, and disposal.",
      fontSize: 8
    },

    {
      text: "5. Materials",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will provide all materials, labor, and equipment. Unless stated otherwise, materials will be new and of good quality.",
      fontSize: 8
    },

    {
      text: "6. Compliance with Laws and Design Defects",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will follow all applicable laws and safety rules. Contractor is not responsible for any design defects and is released from any liability arising from them.",
      fontSize: 8
    },


    
    {
      text: "7. Contract Changes (Change Orders)",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 5]
    },
    {
      text:
        "This Contract can only be changed via signed written Change Order by both parties. No verbal changes are valid.",
      fontSize: 8
    },

    {
      text: "8. Coordination and Delays",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will coordinate work based on reasonable scheduling by Owner. Contractor and subcontractors are not liable for third-party delays.",
      fontSize: 8
    },

    {
      text: "9. Failure to Complete Work",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "If Contractor fails to begin within 3 days after notice, Owner may complete the Work and charge additional costs to Contractor.",
      fontSize: 8
    },

    {
      text: "10. Failure to Pay Contractor",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor may terminate this Contract if not paid within 5 days of the due date. Owner remains liable for completed Work, profits, and damages.",
      fontSize: 8
    },


    {
      text: "11. Insurance",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 5]
    },
    {
      text:
        "Owner must insure all buildings and materials against fire. Both Owner and Contractor must be listed on policy.",
      fontSize: 8
    },

    {
      text: "12. Ownership of Materials",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor retains ownership of materials and Work until paid in full. Contractor has access rights to materials during this period.",
      fontSize: 8
    },

    {
      text: "13. Care of Property",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will safeguard Property and surrounding area. Site will be left clean prior to final payment.",
      fontSize: 8
    },

    {
      text: "14. Permits",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will obtain all required permits. Owner pays for permit fees and must cooperate in process.",
      fontSize: 8
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    ...createFooter(finalPageNumber + 5)
  ]
});



//Contract 6




docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Contract"),

    {
      text: "15. Notices",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 5]
    },
    {
      text:
        "All notices must be written and delivered personally or by email to addresses in this Contract or to the party’s attorney.",
      fontSize: 8
    },

    {
      text: "16. Parties Bound",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text: "This Contract binds both parties and their legal successors.",
      fontSize: 8
    },

    {
      text: "17. Retainage",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "5% of contract price may be retained for punch-out. Full trade payment due upon substantial completion.",
      fontSize: 8
    },

    {
      text: "18. Payment to Subcontractors (\"Pay When Paid\" Clause)",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Contractor will pay subcontractors within 30–45 days of invoice, even if Owner has not yet paid. This is subject to state law.",
      fontSize: 8
    },

    {
      text: "19. Termination for Convenience",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 5]
    },
    {
      text:
        "Owner may terminate this Contract at any time with written notice. Contractor will be paid for completed Work, materials, and reasonable demobilization — not lost profits.",
      fontSize: 8
    },

    {
      text: "20. Notice to Owner",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "a. DO NOT SIGN THIS CONTRACT IF BLANK.\nb. YOU ARE ENTITLED TO A COPY OF THE CONTRACT AT THE TIME YOU SIGN.\nc. KEEP IT TO PROTECT YOUR LEGAL RIGHTS.\n\nDo not sign any completion certificate or agreement stating that you are satisfied with the entire project before it is complete.",
      fontSize: 8
    },

    {
      text: "21. Signatures",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 5]
    },
    {
      text:
        "Both parties agree to this Contract via electronic signature on the Authorization Page. Owner acknowledges receipt of a fully executed copy.",
      fontSize: 8,
      margin: [0, 0, 0, 30]
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    createFooter(finalPageNumber + 6)
  ]
});





}




























// =================  SIGNATURES PAGE (plus options)=================
if (formData.pdfToggles?.signaturePage) {
docDefinition.content.push({
  pageBreak: "before",
  stack: [

    // =================== NORMAL HEADER ===================
    ...createStandardHeader("Signature Page"),

    // =================== SIGNATURE BLOCK ===================
    {
      columns: [
        {
          width: "50%",
          stack: [
             {
      text: "Client",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 5]
    },
            {
              text: (formData.clientname ? formData.clientname + ":" : "______________:"),
              bold: true,
              fontSize: 9,
              margin: [0, 0, 0, 3]
            },
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }
              ],
              margin: [0, 0, 0, 5]
            },
{
  text: formData.clientSignature || "______________",
  fontSize: 14,
  italics: true,
  characterSpacing: 0.5,
  alignment: "left",
  margin: [70, -25, 0, 20], // shifts right onto the signature line
},
{
      text: "Inspector",
      bold: true,
      fontSize: 10,
      margin: [0, 15, 0, 5]
    },


            {
              text: (formData.inspectorName ? formData.inspectorName + ":" : "______________:"),
              bold: true,
              fontSize: 9,
              margin: [0, 10, 0, 3]
            },
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }
              ],
              margin: [0, 0, 0, 5]
            },
{
  text: formData.inspectorSignature || "______________",
  fontSize: 14,
  italics: true,
  characterSpacing: 0.5,
  alignment: "left",
  margin: [70, -25, 0, 20], // aligns on the line just like client signature
},


          ]
        },
        {
          width: "50%",
          stack: [
            {
              text: "Date:",
              bold: true,
              fontSize: 9,
              margin: [0, 0, 0, 3]
            },
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }
              ],
              margin: [0, 0, 0, 5]
            },
{
  text: formData.clientSignedDate
    ? `Signed on: ${new Date(formData.clientSignedDate).toLocaleDateString()}`
    : "Not yet signed.",
  fontSize: 8,
  italics: true,
  margin: [30, -15, 0, 10]
},


            {
              text: "Date:",
              bold: true,
              fontSize: 9,
              margin: [0, 10, 0, 3]
            },
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }
              ],
              margin: [0, 0, 0, 5]
            },
{
  text: formData.inspectorSignedDate
    ? `Signed on: ${new Date(formData.inspectorSignedDate).toLocaleDateString()}`
    : "Not yet signed.",
  fontSize: 8,
  italics: true,
  margin: [30, -15, 0, 10]
}

          ]
        }
      ],
      columnGap: 40,
      margin: [0, 80, 0, 40]
    },

// ======= Optional Add-Ons (Selected Upon Signing) =======
  {
      text: "Final Price:",
      style: "subheader",
      margin: [0, 0, 0, 10]
    },
...(formData?.optionalAddOns?.length > 0
  ? formData.optionalAddOns.map(addon => ({

          text: `• ${addon.title} - $${addon.price}\n${addon.description}`,
          margin: [0, 0, 0, 10]
        }))
      : [{
          text: "• No optional add-ons selected.",
          margin: [0, 0, 0, 10]
        }]),
    

    // =================== NORMAL FOOTER ===================
    createFooter(finalPageNumber + 7)
  ]
});



}











// ================= LABOR WARRANTY - PAGE 1 =================
if (formData.pdfToggles?.laborWarranty) {
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Labor Warranty"),



    {
      text: "Warranty",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "Upon payment in full for our work, we warrant that we applied the roofing materials in accordance with (a) the written specifications of the Roofing Materials Manufacturer and (b) good and workmanlike manner according to standard construction practices in effect on the date the roof covering was installed, subject to the terms, conditions and limitations stated in this Warranty. During the term of this Warranty, upon receipt of written notice, we will, at our expense, repair any leaks in the new roof covering which are the result of defects in our workmanship for a period of 2 (Two) years. Once this Warranty expires, any obligation to make repairs at our expense under any provision of this Warranty shall cease to exist.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Terms, Conditions and Limitations",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "This Warranty excludes any leaks caused by fire, lightning, peak gust wind speeds exceeding 50 mph measured at eave level, hailstorm, flood, earthquake, or other extraordinary weather phenomena; structural settlement; failure, movement, cracking or excess deflection of the roof deck or exterior walls; defects or failure the pre-existing substrate over which the roofing system is applied; any faulty condition causing movement of parapet walls, copings, chimneys, skylights, ventilation supports or other parts of the building; vapor condensation beneath the roof covering; penetration of pitch boxes; erosion, cracking and porosity of mortar and brick; dry rot; penetrations of the roof from underneath by pre-existing rising fasteners of any type; insufficient drainage, clogging of roof drains and/or gutters, inadequate pitch or other conditions beyond our control which cause ponding or standing water; damage by termites or other insects, rodents or other animals; harmful chemicals, oils, acids and the like that come in contact with the roofing system and cause a leak or otherwise damage said system, any acts or omissions that compromise the watertight condition of the roof system. If the roof fails to maintain a watertight condition because of damage due to any of the foregoing, this Warranty shall immediately become null and void unless we are hired, at a reasonable expense, to repair said damage. This Warranty shall be null and void if you fail to comply with the conditions outlined in this Warranty, or if any work is done on the roof by you or others, including work in connection with any roof penetrations, vents, flues, drains, gutters, sign braces, railings, platforms or other equipment fastened to or set on the roof, or if repairs or alterations are made to the roof without first notifying us in writing and giving us a reasonable opportunity to make the necessary repairs. We shall be reasonably compensated for the time and materials expended in making recommendations or repairs occasioned by the work of others on the subject roof.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Notification",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "During the term of this warranty we must be promptly notified in writing of any roof leak within 72 hours after it was or should have been detected the leak and provide us a reasonable opportunity to inspect and repair the roof, and all action reasonably necessary to prevent any further damage to the property must be taken. Multiple inspections may be necessary to determine the cause and origin of the roof leak. You agree to cooperate with us by providing us reasonably necessary access, at reasonable times, to the exterior and interior of the property to investigate the leak.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Transferability",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "In the event ownership of this property changes, this warranty will be transferable one (1) time only. However, any transferred Warranty will remain in effect for, and is limited to three (3) years from the completion date set forth below, and applies to leaks only.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Exclusivity",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "This Warranty is separate from any warranty that may be issued to you by the Roofing Material Manufacturer. WE SPECIFICALLY DISCLAIM ANY LIABILITY FOR CLAIMS ATTRIBUTABLE TO DEFECTS IN THE ROOFING MATERIALS OR THE ROOFING MATERIALS MANUFACTURER’S WARRANTY. THE REPAIR OF THE SUBJECT ROOF IS THE EXCLUSIVE AND SOLE REMEDY UNDER THIS WARRANTY AND EXPRESSLY EXCLUDES ANY REPAIRS OR REIMBURSEMENT FOR WATER DAMAGE TO INTERIOR. THE WARRANTY SPECIFICALLY EXCLUDES ALL ENVIRONMENTAL CONDITIONS, INCLUDING, THE PRESENCE OF MOLD, FUNGUS, MYCOTOXINS, SPORES, OR OTHER INFESTATIONS OR CONTAMINATES CLAIMED TO BE CAUSED BY MOISTURE, LEAKS, OTHER WATER INTRUSION OR ANY CONTAMINATION, EVEN IF SUCH CONDITIONS ARE CLAIMED TO BE CAUSED BY OUR NEGLIGENCE. ALL OTHER EXPRESS OR IMPLIED WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, ARE EXPRESSLY EXCLUDED AND DISCLAIMED.",
      fontSize: 8,
      margin: [0, 0, 0, 25]
    },




    createFooter(finalPageNumber + 8)
  ]
});




























// ================= LABOR WARRANTY - PAGE 2 =================
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Labor Warranty"),



    {
      text: "INCIDENTAL OR CONSEQUENTIAL DAMAGES",
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 3]
    },
    {
      text:
        "UNDER NO CIRCUMSTANCES SHALL WE BE LIABLE FOR ANY INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR OTHER DAMAGES INCLUDING LOSS OF PROFITS OR DAMAGE TO THE BUILDING OR ITS CONTENTS, WHETHER ARISING OUT OF BREACH OF WARRANTY, BREACH OF CONTRACT OR UNDER ANY OTHER THEORY OF LAW.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Facer Delamination",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "In the event the scope of work requires direct adhesion of a single-ply system without the use of a cover board, Contractor disclaims liability for any damage that may occur as a result including, without limitation, facer delamination.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Acceptance of Deck",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Contractor’s commencement of roof installation indicates only that Contractor has visually inspected the surface of the roof deck for visible defects. Roofing Contractor’s prosecution of the roof work indicates only that the surface of the deck appears satisfactory to the Roofing Contractor to attach roofing materials. Roofing Contractor is not responsible for the construction, slope, moisture content, undulations, or structural sufficiency of the roof deck or other trades’ work or design and their effect on the roof and roofing materials. Roofing Contractor is not responsible for condensation, moisture migration from the building interior or other building components, location or size of roof drains, adequacy of drainage, ponding on the roof, structural conditions, or the properties of the roof deck or substrate on which Roofing Contractors roofing work is installed.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Roof to Wall Connection Provision",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Contractor disclaims liability for damages caused by water, air, or vapor intrusion at roof to wall connections resulting from structural movement, improper wall anchorage, improper installation of work not performed by contractor, or other events outside contractor's reasonable control. Subcontractor shall not be responsible for damage caused by circumstances beyond the control of Subcontractor. Contractor shall coordinate the Project so that the Project proceeds in an orderly and customary manner and so as to avoid newly installed roofing being damaged by or used as a surface for ongoing construction work. If the Subcontractor’s Work is damaged by other trades, Contractor agrees to backcharge the trades causing the damage. Contractor will purchase or arrange with Owner to maintain Builder’s Risk and property insurance.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "Utilities Under Deck",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Unforeseen Decking Lines: Installation of a new roof to the deck area of the building requires nails and/or screws to be inserted into the deck area. By code, electrical, telephone, security wiring, HVAC wiring and lines should not be installed directly beneath the roof deck. If you are aware of these or any other such lines please notify us immediately as the Contractor will not be responsible for the puncture of improperly installed lines or lines within three inches of the roof deck. Customer assumes and accepts full responsibility for any repair or replacement that may be necessary.",
      fontSize: 8,
      margin: [0, 0, 0, 30]
    },
    

    createFooter(finalPageNumber + 9)
  ]
});


}























if (formData.pdfToggles?.termsAndConditions) {

// ================ TERMS & CONDITIONS - PAGE 1 =================
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Terms and Conditions"),

    {
      text: "A. FINAL SCOPE OF WORK AND AGREEMENT PRICE",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 3]
    },
    {
      text:
        "We will perform the Final Scope of Work (the Work) for the Agreement Price. The Agreement Price does not include any builder’s risk insurance coverage, which may be provided for an additional fee upon request. We reserve the right to perform any changed/additional work with your verbal instruction, but shall not be required to perform such work without a signed Change Order.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "B. TERMS OF PAYMENT",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Payment per Trade Policy: We reserve the right to invoice you once any particular trade is fully completed and to collect said payment in full before beginning any succeeding trade. Any balance remaining shall be due upon substantial completion of the Work. You acknowledge that payment in full for the Work is a precondition to our obligation to honor our Labor Warranty or to provide the Material Warranty. Acceptance of late or partial payments (regardless of any purported limitations such as ‘Paid in Full’, ‘Accord and Satisfaction’, or similar), will not waive, limit, or prejudice our right to collect any amounts due. You agree that if any amounts due for completed work are not paid when due, you shall be liable to pay all costs of collection, including reasonable attorney’s fees and collection costs which, together with all sums due hereunder, shall bear interest at the maximum rate allowable by law until paid in full. You further agree that we shall be entitled to an enforceable contractual lien against the property and any insurance proceeds as security to ensure payment for our Work.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "C. OUR RESPONSIBILITY",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "We agree to perform our Work in a professional, efficient, good and workmanlike manner, according to standard construction practices and all applicable building codes. We will supervise and direct all work using our best skill and attention and be solely responsible for all construction means, methods, techniques, sequences and procedures, and for contracting and performing all portions of the Work under this Agreement. You agree that we are not responsible for the safety and health of any persons present at the job site who are not our employees, subcontractors or agents or for the failure of any materials or equipment not within our direct control. All material we provide is guaranteed to be as specified. In the event that material has to be restocked or reordered because of a cancellation or interference by you or at your direction, in addition to any other fees or costs associated therewith, there will be a materials restocking fee equal to 15% of the value of the applicable materials. Acceptance of this Agreement by you shall constitute acceptance of the terms, conditions and limitations of said warranty. You agree that our maximum liability, in the event of any default by us, shall not exceed the total sum paid to us for our Work, except in cases of incidents that arise due to Negligence. Where colors are to be matched, Contractor shall make reasonable efforts using standard colors and materials but does not guarantee a perfect match. All materials and work shall be furnished in accordance with normal industry tolerances for color, variation, thickness, size, weight, amount, finish, texture and performance standards.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "D. YOUR RESPONSIBILITY",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "You certify that your property insurance policy is and will remain valid and in force until completion of the Work. Certificates of such insurance shall be provided to us if requested. You authorize us access to enter your property, furnish materials, and supply all equipment and labor necessary to perform all work identified in the Final Scope of Work. Should you become aware of any damage to your property you believe was caused by us, our subcontractors, agents or employees during the course of the Work, you must notify us of said damage prior to the time of final payment for the work in question. If you fail to notify us, you waive all rights against us concerning said damage. You acknowledge that we are not responsible for damage to...",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    createFooter(finalPageNumber + 10)
  ]
});







//Additional page 2
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Terms and Conditions"),

 {
  text:
    "Landscaping, driveway or sidewalks as a result of normal construction activities. You further acknowledge that re-roofing an existing building may cause dust or debris to fall into the interior, and may cause objects to fall from the interior ceilings and walls. You therefore agree to remove or protect interior and exterior property directly below the roof in order to minimize potential property damage, and that you are solely responsible for any disturbance, damage, clean-up, or loss to property resulting from your failure to do so prior to commencement of construction. You acknowledge that any loss of productivity experienced by us due to interference by you or at your direction may result in an additional charge. You understand that by code, nails must penetrate the roof deck at least 1⁄4” and warrant that all electrical wiring, HVAC, plumbing and/or gas lines have been installed according to all applicable building codes and agree that we are not liable for any punctures through lines closer than 3” from the underside of your roof deck. Contractor shall not be liable for the structural sufficiency, quality of construction, undulations, or moisture content of the roof deck. Furthermore, you understand that nail pops on textured ceilings cannot reasonably be avoided during the installation of a roof and agree not to hold us liable for any nail pops or drywall cracking or movement incidental to the construction process. It is your responsibility to address any concern about ponding areas on the roof before work commences, and agree that any repairs necessary to correct ponding not the result of our work will be charged to you as an extra. You agree that your property insurance shall be liable for any interior damage that occurs as a result of our work provided we have taken reasonable care to protect the roof and interior during our Work.",
  fontSize: 8,
  margin: [0, 0, 0, 8]
},

    {
      text: "E. WORK SCHEDULE",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "You authorize us to perform the Final Scope of Work and to commence construction AS SOON AS FEASIBLE after the execution of this Construction Agreement. We agree to diligently pursue completion of the Work, however, we are not responsible for delays beyond our control such as floods, tornadoes, earthquakes, lightning, natural disasters or any other inclement or unfavorable weather; national emergencies, strikes, lockouts, fires, freight embargoes or labor disputes; inability to obtain labor, services or any materials subject to supply shortages; acts or failures to act by you, your agents or tenants which delays the Work; changes in the plans or specifications; acts of war, riots, civil commotion; fires; epidemics, quarantine restrictions; delays caused by any state, government, public authority or public enemy, or any other delays beyond our control. We routinely order more materials than necessary; therefore, all leftover building materials remain our property.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "F. DELAYS AND/OR CANCELLATION",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "This agreement cannot be canceled except by mutual written agreement of all parties. In the event that you elect to delay scheduling the Work or cancel this Agreement, whether or not work has commenced, you expressly acknowledge and agree that we will suffer serious financial harm which cannot be ascertained at this time. As such, you agree that 15% of the Agreement Price, plus the reasonable value of any consultant services of fees expended on your behalf in identifying damage to the Property, would be reasonable compensation as liquidated damages, but not as a penalty, for termination of this Agreement, all of which shall be credited toward the Agreement Price in the event you elect to have us perform the Final Scope of Work.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "G. DISPUTE RESOLUTION",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "You agree that any claim or controversy, arising out of or relating to this Agreement or any alleged breach thereof, shall be determined by binding arbitration in the County in which the property is located under the rules of the Federal Arbitration Act. Absent other agreements by the parties, the arbitration shall be administered by the American Arbitration Association. Any award of the Arbitrator is final and binding and may be entered as a final judgment in any court having jurisdiction thereof. You expressly waive the right to consequential or exemplary damages, to participate in any class actions, and to a trial by jury of any claims arising from this Agreement. In the event it is necessary for us to initiate any collection or legal proceedings to enforce our rights under this Agreement, you agree to pay all legal fees and costs of any nature whatsoever associated therewith incurred by us.",
      fontSize: 8,
      margin: [0, 0, 0, 8]
    },

    {
      text: "H. ASBESTOS AND HAZARDOUS MATERIALS",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "You agree that we are not responsible for expenses, claims, or damages arising out of the presence, disturbance, or removal of mold-containing, asbestos-containing, or any other hazardous materials. If such materials are encountered, we reserve the right to suspend work while you engage a firm specializing in the removal and disposal of such hazardous materials, at your sole expense, or to submit a change order and perform the necessary work for additional compensation. We will be entitled to compensation for any additional expenses incurred as a result of encountering mold-containing...",
      fontSize: 8,
      margin: [0, 0, 0, 30]
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    createFooter(finalPageNumber + 11)
  ]
});



// ================= ADDITIONAL TERMS & CONDITIONS - PAGE 3 =================
docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Terms and Conditions"),

    {
      text:
        "Asbestos-containing, or any other hazardous materials. You acknowledge that mold is a latent but foreseeable condition when specified maintenance procedures to prevent moisture intrusion are not followed. YOU AGREE TO INDEMNIFY, HOLD HARMLESS, AND DEFEND US FROM AND AGAINST ANY AND ALL LIABILITY, DAMAGES, LOSSES, CLAIMS, DEMANDS, FINES, FEES, PENALTIES OR CITATIONS OF ANY KIND, INCLUDING BODILY INJURY OR PROPERTY DAMAGE, NOW OR IN THE FUTURE, INCLUDING, BUT NOT LIMITED TO, THE PRESENCE OF MOLD, ASBESTOS, OR ANY OTHER HAZARDOUS MATERIALS, NOW OR IN THE FUTURE. YOU WILL HOLD HARMLESS AND INDEMNIFY US FROM CLAIMS DUE TO POOR INDOOR AIR QUALITY WHETHER OR NOT RESULTING FROM A FAILURE BY YOU TO MAINTAIN THE INTERIOR OR EXTERIOR OF THE BUILDING IN A MANNER TO AVOID GROWTH OF MOLD OR THE LIKE. We disclaim any and all responsibility for damage to persons or property arising from or relating to the presence of mold in the building and are NOT responsible for any electric, piping, HVAC, ductwork, carpentry, or tuck-pointing. Customer will be required to correct any abnormalities existing such as wiring, conduit, HVAC, electrical, etc.",
      fontSize: 8,
      margin: [0, 30, 0, 10]
    },

    {
      text: "I. SKYLIGHT NOTICE",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Americanstruction strongly suggests that you replace all of your skylights during the re-roof process. Americanstruction is not responsible for any problems or issues as a result of leaving existing skylights in place.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "J. MISCELLANEOUS",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "We shall not be obligated to continue work hereunder in the event you breach any term or condition of this Agreement. This Agreement and all applicable warranties cannot be assigned except with our written permission. In case any one or more of the provisions in this Agreement are determined to be invalid, illegal, or unenforceable in any respect, such provision shall be modified to the minimum extent necessary to make it a valid and enforceable provision. To the extent it cannot be so modified, the Agreement shall be construed as if such provision(s) had never been contained herein. Our failure to enforce any right under any Agreement with you shall not be construed as a waiver of any other right to enforce the same or any other right, term or condition. This Agreement supersedes all previous agreements, arrangements, and understandings, whether verbal or written, between us. There are no representations, oral or written, other than those set forth herein. This Agreement may not be amended, modified, or otherwise changed except as mutually agreed in writing, executed by the parties and shall be binding on and inure to the benefit of the parties and their respective heirs, executors, administrators, legal representatives, successors, and assigns. The headings and captions contained in this Agreement are for convenience of reference only and are not determinative or to be considered in the construction or interpretation of any of the terms, items, conditions or provisions hereof.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "K. BACKCHARGES",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "No back charge or claim against us shall be valid except by written agreement. If you believe we have failed to properly perform our work, you shall notify us of such alleged default in a detailed writing and allow us a reasonable time of at least five full working days to commence appropriate corrective measures (or demonstrate the absence of default) before incurring any cost chargeable to us.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

   {
  text: "L. WARRANTIES",
  bold: true,
  fontSize: 10,
  margin: [0, 10, 0, 3]
},
{
  text:
    "Should leaks occur after completion of our work, inspections, or repairs performed by us shall be treated as warranty matters, and shall not be grounds for withholding payment of the Agreement Price; provided, however, if our work is installed over an existing system, we shall have no responsibility for water penetration or mold growth that occurs as a result of moisture contained in the old, or former, roofing system. THE WARRANTIES EXPRESSLY STATED OR REFERRED TO HEREIN ARE EXCLUSIVE AND IN LIEU OF ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, AND ALL OTHER WARRANTIES ARE HEREBY DISCLAIMED AND EXCLUDED. We make no warranty respecting “Wind Uplift Resistance” of the installed roof system. Our Labor Warranty does not cover damage by lightning, winds over 65 mph, hurricanes, tornadoes, hail storms, impact of foreign objects, damage due to settlement of foundation, or your failure to properly maintain the property. Said Warranty cannot be assigned, is not transferable, and is void if any other contractor alters our Work. Any labor warranty will be revoked if not paid in full. Roofing Contractor is not responsible for damages or leaks due to existing conditions or existing sources of leakage simply because the Roofing Contractor started work on a building or performed repair work. Unless otherwise provided: All warranties/guarantees provided by Contractor, if any, shall be deemed null and void if Customer fails to strictly adhere to the payment terms contained in the Agreement. All warranties and guarantees, if any, provided under the Agreement are solely for the original Customer and are non-transferable, unless otherwise agreed to by Customer and Contractor in writing. Any express warranty provided, if any, by Contractor is the sole and exclusive remedy for alleged construction defects, in lieu of all other remedies, implied or statutory.",
  fontSize: 8,
  margin: [0, 0, 0, 20]
},
 {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    createFooter(finalPageNumber + 12)
  ]
});


/// additional terms and conditions page 4


docDefinition.content.push({
  pageBreak: "before",
  stack: [
    ...createStandardHeader("Terms and Conditions"),

    {
      text: "M. GOVERNING LAW",
      bold: true,
      fontSize: 10,
      margin: [0, 30, 0, 3]
    },
    {
      text:
        "This Agreement shall be governed by and construed in accordance with the laws of the State of Illinois. The prevailing party shall be entitled to recover all costs and expenses arising before, during, or after mediation, arbitration, trial, or any other method of dispute resolution including but not limited to mediation, arbitration or court costs, attorney's fees, and expert witness fees and any such further costs or expenses as may be incurred in any appeal therefrom. The prevailing party shall be defined as the party that is either awarded an amount equal to or greater than 75% of its claim or the party that is only required to pay damages totaling less than 25% of the claim asserted by the other party.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "N. ENTIRE AGREEMENT",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "This Agreement contains the entire and only agreement between the Parties respecting the subject matter hereof and supersedes all prior agreements and understandings between them as to the subject matter hereof; and no modification shall be binding upon Contractor unless made in writing signed by an authorized officer of Contractor. It is further agreed that Schedule A and any documents contained in Schedule A are incorporated into this Agreement by reference, with the same force and effect as if the same were set forth at length therein and the Owner will be and is bound by any and all of said documents contained in Schedule A insofar as they relate in any way to the work covered by this Agreement.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "O. UNRELATED ITEMS THAT EXIST ON THE ROOF OR IN AND AROUND THE PROPERTY",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "We are NOT responsible for any electrical, piping, HVAC, ductwork, carpentry, plumbing, or tuck-pointing on the Roof or in and around the Property. Owner will be required to correct any abnormalities, including, but not limited to wiring, conduit, HVAC, electrical, plumbing, etc. on the roof and in and around the Property. Customer acknowledges that the price of the work to be performed anticipates the use of heavy equipment and or trucks to roof-top materials. It is possible that the driveway, curbs, or walkways may be cracked or damaged because of the weight of the equipment or trucks. Accordingly, the contractor disclaims liability for any cracks or damages caused to the driveway, curbs or walkways. If customer would prefer the contractor to hand lift the materials, the contract price will need to be increased to reflect the additional labor cost.",
      fontSize: 8,
      margin: [0, 0, 0, 10]
    },

    {
      text: "P. SAFETY RESPONSIBILITY OF SUBCONTRACTORS",
      bold: true,
      fontSize: 10,
      margin: [0, 10, 0, 3]
    },
    {
      text:
        "Subcontractor understands and acknowledges that Subcontractor shall control and implement all required safety procedures, and that Contractor shall only perform occasional inspections to determine conformance with the plans and specifications for the project. As a result, Contractor shall not be able to ensure Subcontractor (while working for Contractor) adherence to safety standards and the OSH Act or applicable state health and safety plans because Contractor cannot reasonably be expected to prevent, detect or abate violative conditions by reason of its limited role on the project. Therefore, the Subcontractor shall be solely responsible for controlling safety on the jobsite as it relates to the Subcontractor.",
      fontSize: 8,
      margin: [0, 0, 0, 20]
    },
     {
  absolutePosition: { x: 440, y: 710 }, // 🧭 Adjust as needed
  stack: [
    {
      text: formData.clientInitials || "",
      fontSize: 11,
      bold: true,
      italics: true,
      alignment: "left",
      margin: [20, 0, 0, 2], // spacing above line
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 60,  // line length
          y2: 0,
          lineWidth: 1.5, // ✅ bolder line
        }
      ],
    },
  ],
},

    createFooter(finalPageNumber + 13)
  ]
});



}























































// ================= Service and Maintenance PAGE =================
if (formData.pdfToggles?.serviceAndMaintenance) {
  docDefinition.content.push({
    pageBreak: "before",
    stack: [
      ...createStandardHeader("Service and Maintenance"),

      {
        text:
          "All Low Slope Roofing Systems are susceptible to severe weathering, expansion, contraction, and even abuse. " +
          "It is not uncommon for some leakage to develop at any time after the original roof application as a result of these causes. " +
          "In addition, roofs frequently don’t last their design life, but with proactive inspections and scheduled maintenance, " +
          "Americanstruction can ensure that you’ll beat the odds with a roofing system that lasts beyond its normal life cycle.\n\n" +
          "Even though a manufacturer’s warranty may have been purchased with your new roof, most roofing materials manufacturers " +
          "require regular maintenance to keep roof warranties valid. This means the building owner continues to be responsible for " +
          "the proper roof care and maintenance to insure its top performance.\n\n" +
          "Americanstruction’s goal is to ensure performance of your existing roof system by offering a maintenance program, which " +
          "ultimately reduces the costs incurred for roof repairs and/or replacement.",
        fontSize: 8,
        margin: [0, 0, 0, 15]
      },

      {
        text: "SERVICES",
        bold: true,
        fontSize: 10,
        margin: [0, 0, 0, 5]
      },
      {
        ol: [
          "Inspect the entire roof area for damage that may have resulted from foreign objects or from human activity i.e.: HVAC unit maintenance.",
          "Remove all debris that may have accumulated on the roof surface to ensure it does not restrict drainage or cause roof membrane damage.",
          "Inspect and clean all roof drains, overflow drains, gates, and scupper drains to ensure a free flow of rain water and snow melt.",
          "Inspect all welds at membrane field seams, roof curbs, and roof penetrations. Verify no voids have developed at weld points.",
          "Inspect all sheet metal flashings and counter flashings at copings, gutters, collector boxes, and downspouts to verify they are firmly attached and sealed.",
          "Inspect and verify roof access scuttle, ladder, and locking mechanism are operational and all flashings are in place and secure.",
          "Verify all HVAC unit access doors and covers are installed and secured.",
          "Submit a written report including photos to the building owner detailing the current roof condition, evidence of any roof abuse, and any problems that could potentially lead to future roof problems. Michael DeGregorio is a thermographer capable of conducting thermal scans that can determine the possibility of moisture levels within the roofing system. Price of thermal inspection and report upon request.",
          "Any deficiencies (ie. repairs) will be dealt with on a fixed cost or time and material basis. Contractor will provide the owner or owner’s representative an estimate of the repairs needed. Work will commence upon written approval by the owner or owner’s representative."
        ],
        fontSize: 8,
        margin: [0, 0, 0, 20]
      },

      createFooter(finalPageNumber + 14)
    ]
  });
}
































  // Debug + Create PDF
  console.log("Generated docDefinition:", docDefinition);
  pdfMake.createPdf(docDefinition).download("Roof_Inspection_Report.pdf");


  
};

export default generatePDF;





pdfMake.vfs = pdfFonts.vfs;

export const generateSurveyPDF = (data: {
  clientname: string;
  projectAddress: string;
  surveyAnswers: string;
}) => {
  const { clientname, projectAddress, surveyAnswers } = data;

  const docDefinition = {
    content: [
      { text: "Survey Proposal", style: "header" },
      { text: `Client Name: ${clientname}`, margin: [0, 10, 0, 0] },
      { text: `Project Address: ${projectAddress}`, margin: [0, 5, 0, 0] },
      { text: "Survey Answers:", bold: true, margin: [0, 20, 0, 0] },
      { text: surveyAnswers, margin: [0, 5, 0, 0] },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
    },
  };

  pdfMake.createPdf(docDefinition).download("survey_proposal.pdf");
};
