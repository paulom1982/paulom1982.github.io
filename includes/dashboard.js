// -------------------------------------------------------------------------
// GENERAL FUNCTIONS
// -------------------------------------------------------------------------

// GET TRANSACTIONS LIST
function getTransactions() {
    
    var now = moment();
    var current_year_month = now.format('YYYY-MM');
    
    // USING THE SHEETDB METHOD.
    //    Will likely uste the SheetDB method instead since it supports enough requests for personal use and is much easier to use.  
    //    Using the Google API method below just to test an option that doesn't depend on a 3rd party such as SheetDB.
    $.getJSON('https://sheetdb.io/api/v1/n09q5n4vvki5y', function(myData) {

        // JSON result in 'data' variable
        myDataJson = JSON.stringify(myData);

        console.log(myData)
        console.log(myDataJson);

        // DATATABLES version:
        new DataTable('#transaction_table_dt', {
            responsive: true,
            scrollY: 300,
            deferRender: true,
            scroller: true,            
            data: myData,
            order: [[0, 'desc']], 
            // -----------------------------------------
            // Creates the search/filter panes
            dom: 'PBfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            searchPanes: {
                initCollapsed: true,
                columns: [2,4],       // only show search boxes for these columns,
                cascadePanes: true,   // allows filtering based on values selected in other filters
                viewTotal: true,      // view subtotals alongside totals for each value when filtering
                dtOpts: {             // allows for multi-select on mobile devices  
                    select: {
                        style: 'multi'
                    },
                    order: [[0, 'asc']]
                },
                panes: [
                    {
                        header: 'Timeframe',
                        options: [
                            {
                                label: 'Current Year',
                                value: function(myData, rowIdx) {
                                    var trans_date = myData['Transaction_Date'];
                                    var current_year = moment(trans_date).isSame(new Date(), 'year');
                                    return current_year == true;
                                }
                                //, className: 'tokyo'
                            }, 
                            {
                                label: 'Current Month',
                                value: function(myData, rowIdx) {
                                    var trans_date = myData['Transaction_Date'];
                                    var current_month = moment(trans_date).isSame(new Date(), 'month');
                                    return current_month == true;
                                }
                            },
                            {
                                label: 'Previous Year',
                                value: function(myData, rowIdx) {
                                    var trans_date = myData['Transaction_Date'];
                                    var previous_year = moment(trans_date).isBefore(new Date(), 'year');
                                    return previous_year == true;
                                }
                                //, className: 'tokyo'
                            }, 
                            {
                                label: 'Previous Month',
                                value: function(myData, rowIdx) {
                                    var trans_date = myData['Transaction_Date'];
                                    var previous_month_start = moment().subtract(1, 'months').startOf('month');
                                    var previous_month = moment(trans_date).isAfter(previous_month_start);
                                    var current_month = moment(trans_date).isSame(new Date(), 'month');
                                    return previous_month == true && current_month == false;
                                }
                            }
                        ]                        
                    },
                    {
                        header: 'Custom',
                        options: [
                            {
                                label: 'Expenses Only',
                                value: function(myData, rowIdx) {
                                    return myData['Transaction_Type'] === 'Expense';
                                }
                            }, 
                            {
                                label: 'Groceries this Month',
                                value: function(myData, rowIdx) {
                                    // return myData[0] === '2023-12-09' && myData[3] === 'Groceries';
                                    var trans_date = myData['Transaction_Date'];
                                    return moment(trans_date, 'YYYY-MM-DD').format('YYYY-MM')  === current_year_month && myData['Category_1'] === 'Groceries';
                                }
                            }
                        ]                        
                    }
                ]
            },
            // -----------------------------------------
            columns: [
                {title: 'Transaction Date', data: 'Transaction_Date'},
                {title: 'Type', data: 'Transaction_Type'},
                {title: 'Payee', data: 'Payee'},
                {title: 'Total Amount', data: 'Transaction_Total'},
                {title: 'Category', data: 'Category_1'},
            ]
        });

    });

    // USING THE GOOGLE API METHOD.
    //    source: https://www.sitepoint.com/google-sheets-api-v4-integration-guide/
    //    source: https://chriszarate.github.io/sheetrock/#usage
    // var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1nl1hJd9mAbw4TFrErvpPvWiccrBesnnAtTl7JffK6B0/edit#gid=0';
    // $('#transaction_table').sheetrock({
    //   url: mySpreadsheet,
    //   query: "SELECT A,B,C,D,E,F,G WHERE C = 'Expense' ORDER BY B DESC",
    // }).on('sheetrock:loaded', function () {
    //   $(this).DataTable({responsive: true});
    // });

};