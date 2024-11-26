// import AsyncHandler from 'express-async-handler';
// import axios from 'axios';

// export const ConnectTally = AsyncHandler(async (req, res) => {
//     // Log for debugging purposes (remove in production)
//     console.log("Connecting to Tally");

//     // Define the Tally HTTP server URL (ensure Tally's HTTP server is running on port 9000)
//     const url = 'http://localhost:9000';

//     // Construct the XML request body
//     const xmlData = `
//     <ENVELOPE>
//       <HEADER>
//         <TALLYREQUEST>Import Data</TALLYREQUEST>
//       </HEADER>
//       <BODY>
//         <IMPORTDATA>
//           <REQUESTDESC>
//             <REPORTNAME>All Masters</REPORTNAME>
//             <STATICVARIABLES>
//               <SVCURRENTCOMPANY>Demo</SVCURRENTCOMPANY> <!-- Your Tally Company Name -->
//             </STATICVARIABLES>
//           </REQUESTDESC>
//           <REQUESTDATA>
//             <TALLYMESSAGE xmlns:UDF="TallyUDF">
//               <LEDGER>
//                 <NAME>Rejoy</NAME>
//                 <PARENT>Current Assets</PARENT>
//                 <OPENINGBALANCE>0</OPENINGBALANCE> <!-- Optional: Opening balance -->
//                 <ISDELETED>No</ISDELETED>
//               </LEDGER>
//             </TALLYMESSAGE>
//           </REQUESTDATA>
//         </IMPORTDATA>
//       </BODY>
//     </ENVELOPE>`;
  



//     try {
//         // Make the POST request to Tally's XML API endpoint
//         const response = await axios.post(url, xmlData, {
//             headers: {
//                 'Content-Type': 'application/xml',
//             },
//         });

//         // Log the response data for debugging (can be removed in production)
//         console.log('Response from Tally:', response.data);

//         // Return the XML data (or processed data) as a JSON response
//         return res.status(200).json({
//             success: true,
//             data: response.data,
//         });
//     } catch (error) {
//         // Handle any errors during the request to Tally
//         console.error('Error connecting to Tally:', error);

//         // Return error response with appropriate status code
//         return res.status(500).json({
//             error: 'Failed to connect to Tally or retrieve data',
//             details: error.message
//         });
//     }
// });
import AsyncHandler from 'express-async-handler';
import axios from 'axios';

// Define the Tally API URL
const TALLY_URL = 'http://localhost:9000';

// Function to generate XML data for the ledger creation
const generateLedgerXML = (name, parent, openingBalance = 0) => {
    return `
    <ENVELOPE>
        <HEADER>
            <TALLYREQUEST>Import Data</TALLYREQUEST>
        </HEADER>
        <BODY>
            <IMPORTDATA>
                <REQUESTDESC>
                    <REPORTNAME>All Masters</REPORTNAME>
                    <STATICVARIABLES>
                        <SVCURRENTCOMPANY>Demo</SVCURRENTCOMPANY> <!-- Your Tally Company Name -->
                    </STATICVARIABLES>
                </REQUESTDESC>
                <REQUESTDATA>
                    <TALLYMESSAGE xmlns:UDF="TallyUDF">
                        <LEDGER>
                            <NAME>${name}</NAME>
                            <PARENT>${parent}</PARENT>
                            <OPENINGBALANCE>${openingBalance}</OPENINGBALANCE>
                            <ISDELETED>No</ISDELETED>
                        </LEDGER>
                    </TALLYMESSAGE>
                </REQUESTDATA>
            </IMPORTDATA>
        </BODY>
    </ENVELOPE>`;
};

// API handler to connect to Tally and create the ledger
export const ConnectTally = AsyncHandler(async (req, res) => {
    try {
        console.log("Connecting to Tally...");

        // Extract data from request body (if needed)
        const { name, parent, openingBalance } = req.body;

        // Validate input data
        if (!name || !parent) {
            return res.status(400).json({
                success: false,
                message: 'Name and Parent are required fields.'
            });
        }

        // Generate XML data for ledger creation
        const xmlData = generateLedgerXML(name, parent, openingBalance);

        // Make the POST request to Tally's XML API endpoint
        const response = await axios.post(TALLY_URL, xmlData, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Log the response data for debugging (can be removed in production)
        console.log('Response from Tally:', response.data);

        // Return the XML data (or processed data) as a JSON response
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        // Handle any errors during the request to Tally
        console.error('Error connecting to Tally:', error);

        // Return error response with appropriate status code
        return res.status(500).json({
            success: false,
            error: 'Failed to connect to Tally or retrieve data',
            details: error.message
        });
    }
});
