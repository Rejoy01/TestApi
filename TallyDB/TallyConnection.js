import AsyncHandler from 'express-async-handler';
import axios from 'axios';

// Define the Tally API URL
const TALLY_URL = 'http://localhost:9000';

// Function to generate XML data for the ledger creation
const generateLedgerXML = (name, parent, openingBalance = 0, email, address, pincode, state, country) => {
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

                            <!-- Mailing Details -->
                            <LEDMAILINGDETAILS.LIST>
                                <ADDRESS.LIST TYPE="String">
                                    <ADDRESS>${address}</ADDRESS>
                                </ADDRESS.LIST>
                                <APPLICABLEFROM>20240401</APPLICABLEFROM>
                                <PINCODE>${pincode}</PINCODE>
                                <STATE>${state}</STATE>
                                <COUNTRY>${country}</COUNTRY>
                                <EMAIL>${email}</EMAIL>
                            </LEDMAILINGDETAILS.LIST>

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

        // Extract data from request body (including address details)
        const { name, parent, openingBalance, email, address, pincode, state, country } = req.body;

        // Validate input data
        if (!name || !parent || !email || !address || !pincode || !state || !country) {
            return res.status(400).json({
                success: false,
                message: 'Name, Parent, Email, Address, Pincode, State, and Country are required fields.'
            });
        }

        // Generate XML data for ledger creation
        const xmlData = generateLedgerXML(name, parent, openingBalance, email, address, pincode, state, country);

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