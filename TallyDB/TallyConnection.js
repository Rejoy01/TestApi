import AsyncHandler from 'express-async-handler';
import axios from 'axios';
import odbc from 'odbc';

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
//    / const query = `SELECT $Name FROM Ledger WHERE $Name = ?`;

    try {
        console.log("Connecting to Tally...");

        const connection = await odbc.connect('DSN=TallyODBC64_9000');

        // Extract data from request body
        const { name, parent, openingBalance, email, address, pincode, state, country } = req.body;

        const query = `SELECT $Name FROM Ledger WHERE $Name = '${name}'`;
        // Check if the ledger already exists
        const data = await connection.query(query);

        if (data.length > 0) {
            // If a ledger with the given name already exists, return an error response
            return res.status(400).json({
                success: false,
                error: 'User already exists',
            });
        }

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

        // Log the response data for debugging
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
    } finally {
        // Ensure the connection is closed even if an error occurs
        if (connection) {
            await connection.close();
        }
    }
});




// Get request from tally


import { parseStringPromise } from 'xml2js';



// Function to generate XML request for retrieving all ledger details
const generateLedgerRequestXML = () => {
    return `
    <ENVELOPE>
    <HEADER>
     <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
     <IMPORTDATA>
      <REQUESTDESC>
       <REPORTNAME>All Masters</REPORTNAME>
       <STATICVARIABLES>
        <SVCURRENTCOMPANY>Demo</SVCURRENTCOMPANY>
       </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
   </REQUESTDATA> 
     </IMPORTDATA>
    </BODY>
   </ENVELOPE>`;
};

// API handler to connect to Tally and get all ledger details
export const GetAllLedgers = AsyncHandler(async (req, res) => {
    try {
        console.log("Requesting all ledger details from Tally...");

        // Generate XML request for retrieving ledgers
        const xmlData = generateLedgerRequestXML();

        // Make the POST request to Tally's XML API endpoint
        const response = await axios.post(TALLY_URL, xmlData, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Log the response data for debugging
        console.log('Response from Tally:', response.data);

        // Parse the XML response to JSON format for easier handling
        const parsedData = await parseStringPromise(response.data);
        console.log('Keys in parsed response:', Object.keys(parsedData))
        // Return the parsed data as a JSON response
        return res.status(200).json({
            success: true,
            data: parsedData,
        });
    } catch (error) {
        // Handle any errors during the request to Tally
        console.error('Error connecting to Tally:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to connect to Tally or retrieve data',
            details: error.message,
        });
    }
});

export const connectToTally = AsyncHandler(async (req, res) => {
    try {
        // Establish a connection to Tally ODBC c
        const connection = await odbc.connect('DSN=TallyODBC64_9000');
        // Execute a query to retrieve data
        const data = await connection.query('SELECT $Name FROM Ledger');
        console.log('Data from Tally:', data);

        // Close the connection
        await connection.close();

        // Send the data as a JSON response
        return res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error('Error connecting to Tally:', error);

        // Send an error response
        return res.status(500).json({
            success: false,
            error: 'Failed to connect to Tally or retrieve data',
            details: error.message,
        });
    }
});




export const getAllLedgers = AsyncHandler(async (req, res) => {
    try {
        console.log("Requesting all ledger details from Tally...");

        // Create an XML request to retrieve ledger details
        const xmlData = `
            <ENVELOPE>
                <HEADER>
                    <TALLYREQUEST>
                        <REQUESTTYPE>Export</REQUESTTYPE>
                        <REQUESTDATA>
                            <EXPORTDATA>
                                <TABLE name="Ledgers">
                                    <COLS>
                                        <COL name="Name" />
                                        <COL name="Opening Balance" />
                                    </COLS>
                                </TABLE>
                            </EXPORTDATA>
                        </REQUESTDATA>
                    </TALLYREQUEST>
                </HEADER>
                <BODY>
                    <EXPORTDATA>
                        <DATA>
                            <TALLY>
                                <REQUEST>Get</REQUEST>
                            </TALLY>
                        </DATA>
                    </EXPORTDATA>
                </BODY>
            </ENVELOPE>
        `;

        // Send the XML data as a POST request to Tally
        const response = await axios.post('http://localhost:9000', xmlData, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        console.log('Response from Tally:', response.data);

        // Parse the XML response into JSON format
        const parsedData = await parseStringPromise(response.data);
        console.log('Parsed response:', parsedData);

        // Send parsed data as JSON response
        res.status(200).json({
            success: true,
            data: parsedData,
        });
    } catch (error) {
        console.error('Error connecting to Tally:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to connect to Tally or retrieve data',
            details: error.message,
        });
    }
});
