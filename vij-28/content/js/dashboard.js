/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9368836291913215, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "click-catogery"], "isController": true}, {"data": [1.0, 500, 1500, "click-proceedtocheckout-193"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "loginbyusername-password"], "isController": true}, {"data": [1.0, 500, 1500, "click-productid-189"], "isController": false}, {"data": [1.0, 500, 1500, "click-catogery-188"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "click-continue"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "signout"], "isController": true}, {"data": [1.0, 500, 1500, "click-itemid"], "isController": true}, {"data": [1.0, 500, 1500, "click-confirm"], "isController": true}, {"data": [1.0, 500, 1500, "click-proceedtocheckout"], "isController": true}, {"data": [1.0, 500, 1500, "click-confirm-198"], "isController": false}, {"data": [1.0, 500, 1500, "signout-200"], "isController": false}, {"data": [1.0, 500, 1500, "signout-199-1"], "isController": false}, {"data": [1.0, 500, 1500, "signout-199-0"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "click-signin"], "isController": true}, {"data": [1.0, 500, 1500, "click-itemid-190"], "isController": false}, {"data": [1.0, 500, 1500, "click-addtocart"], "isController": true}, {"data": [0.47413793103448276, 500, 1500, "Launch-142"], "isController": false}, {"data": [1.0, 500, 1500, "click-productid"], "isController": true}, {"data": [0.47368421052631576, 500, 1500, "Launch"], "isController": true}, {"data": [0.9795918367346939, 500, 1500, "signout-199"], "isController": false}, {"data": [1.0, 500, 1500, "loginbyusername-password-183-1"], "isController": false}, {"data": [1.0, 500, 1500, "click-addtocart-192"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "loginbyusername-password-183-0"], "isController": false}, {"data": [1.0, 500, 1500, "click-continue-197"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "loginbyusername-password-184"], "isController": false}, {"data": [1.0, 500, 1500, "click-signin-155"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "loginbyusername-password-183"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 926, 0, 0.0, 247.39524838012943, 0, 3509, 167.0, 378.60000000000014, 679.2499999999999, 1142.8600000000015, 9.656898529565126, 40.30059263870059, 7.757790502137866], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["click-catogery", 56, 0, 0.0, 173.8571428571428, 0, 290, 165.0, 216.60000000000005, 256.79999999999995, 290.0, 0.6509281538050238, 2.45974425279841, 0.40654631397403257], "isController": true}, {"data": ["click-proceedtocheckout-193", 54, 0, 0.0, 179.59259259259258, 160, 357, 165.0, 230.0, 265.25, 357.0, 0.6657132994723606, 3.602263078492529, 0.4316734676266088], "isController": false}, {"data": ["loginbyusername-password", 57, 0, 0.0, 591.6315789473684, 483, 1715, 505.0, 802.6, 959.799999999997, 1715.0, 0.638169238003538, 6.493761230938893, 1.5263340151201326], "isController": true}, {"data": ["click-productid-189", 55, 0, 0.0, 167.98181818181814, 162, 213, 165.0, 173.8, 188.19999999999996, 213.0, 0.6765317293381059, 2.7681102931227475, 0.45074887449721396], "isController": false}, {"data": ["click-catogery-188", 55, 0, 0.0, 177.0181818181818, 160, 290, 165.0, 217.79999999999998, 257.4, 290.0, 0.6761990238145001, 2.601697355600772, 0.43000831033232106], "isController": false}, {"data": ["click-continue", 54, 0, 0.0, 208.12962962962962, 0, 1967, 167.0, 225.5, 281.25, 1967.0, 0.6644681793571886, 2.969762756404735, 0.8171146507542945], "isController": true}, {"data": ["signout", 51, 0, 0.0, 521.2549019607845, 0, 1365, 504.0, 622.8000000000002, 698.3999999999999, 1365.0, 0.641872758164999, 6.1125155355232526, 1.159252387357624], "isController": true}, {"data": ["click-itemid", 55, 0, 0.0, 189.83636363636367, 161, 393, 167.0, 279.79999999999995, 321.0, 393.0, 0.6763653356616698, 2.605831960106743, 0.4463987196711635], "isController": true}, {"data": ["click-confirm", 52, 0, 0.0, 177.25, 0, 307, 168.0, 236.5, 254.9999999999999, 307.0, 0.6408281471440015, 3.294389576529669, 0.3934291045350915], "isController": true}, {"data": ["click-proceedtocheckout", 55, 0, 0.0, 176.3272727272727, 0, 357, 165.0, 229.6, 265.0, 357.0, 0.6783507443357712, 3.603906953403471, 0.4318704596751317], "isController": true}, {"data": ["click-confirm-198", 51, 0, 0.0, 180.72549019607843, 161, 307, 168.0, 237.00000000000003, 255.99999999999997, 307.0, 0.6403978000452046, 3.356729729369145, 0.40087401350485946], "isController": false}, {"data": ["signout-200", 48, 0, 0.0, 175.29166666666666, 160, 312, 164.0, 208.4, 246.09999999999988, 312.0, 0.6371963361210673, 3.0945091596973318, 0.40011449621664674], "isController": false}, {"data": ["signout-199-1", 49, 0, 0.0, 176.22448979591843, 161, 336, 164.0, 229.0, 241.0, 336.0, 0.6507909101775728, 3.208195815016004, 0.4086509328556439], "isController": false}, {"data": ["signout-199-0", 49, 0, 0.0, 173.08163265306123, 159, 325, 162.0, 199.0, 226.5, 325.0, 0.6512666471729711, 0.14628059457986656, 0.4146736855046652], "isController": false}, {"data": ["click-signin", 58, 0, 0.0, 203.17241379310343, 161, 1366, 167.0, 229.8, 267.34999999999985, 1366.0, 0.6341500748953105, 2.5358955934770013, 0.41863813538010736], "isController": true}, {"data": ["click-itemid-190", 55, 0, 0.0, 189.83636363636367, 161, 393, 167.0, 279.79999999999995, 321.0, 393.0, 0.6777071319434176, 2.611001497116664, 0.44728430045221546], "isController": false}, {"data": ["click-addtocart", 55, 0, 0.0, 181.70909090909092, 160, 405, 167.0, 238.0, 277.4, 405.0, 0.6775652002513151, 3.1850015745691302, 0.4471906260394466], "isController": true}, {"data": ["Launch-142", 58, 0, 0.0, 818.0172413793105, 648, 3509, 711.5, 1067.7, 1671.8499999999997, 3509.0, 0.6196713604991559, 3.0814961323959915, 0.35634859318575185], "isController": false}, {"data": ["click-productid", 55, 0, 0.0, 167.98181818181814, 162, 213, 165.0, 173.8, 188.19999999999996, 213.0, 0.6762405941081001, 2.7669190785914526, 0.45055490151477895], "isController": true}, {"data": ["Launch", 57, 0, 0.0, 819.8596491228069, 648, 3509, 710.0, 1069.4, 1676.6999999999994, 3509.0, 0.6076305606191436, 3.0156664747833317, 0.3498810223384182], "isController": true}, {"data": ["signout-199", 49, 0, 0.0, 349.59183673469386, 320, 545, 328.0, 400.0, 485.0, 545.0, 0.6493678602666384, 3.347034732897771, 0.8212220498489226], "isController": false}, {"data": ["loginbyusername-password-183-1", 57, 0, 0.0, 185.56140350877195, 160, 348, 164.0, 258.0, 328.5999999999999, 348.0, 0.6475506679996365, 3.25040081398255, 0.4831335062028538], "isController": false}, {"data": ["click-addtocart-192", 55, 0, 0.0, 181.70909090909092, 160, 405, 167.0, 238.0, 277.4, 405.0, 0.6783005488068077, 3.1884581958747, 0.44767595347474876], "isController": false}, {"data": ["loginbyusername-password-183-0", 57, 0, 0.0, 192.3157894736842, 160, 582, 163.0, 260.6000000000002, 351.49999999999943, 582.0, 0.6473373990664714, 0.1453980486184457, 0.6454409027801438], "isController": false}, {"data": ["click-continue-197", 53, 0, 0.0, 180.8301886792453, 163, 321, 168.0, 227.00000000000003, 281.1999999999999, 321.0, 0.6517221450266222, 2.9677542600186912, 0.8165620235050356], "isController": false}, {"data": ["loginbyusername-password-184", 56, 0, 0.0, 198.42857142857144, 159, 1296, 164.0, 245.3000000000001, 274.29999999999995, 1296.0, 0.6489518269152771, 3.257433974945824, 0.4284096044870383], "isController": false}, {"data": ["click-signin-155", 58, 0, 0.0, 184.551724137931, 161, 312, 167.0, 229.8, 266.04999999999995, 312.0, 0.6412098967430959, 2.564127035565039, 0.4232987208968095], "isController": false}, {"data": ["loginbyusername-password-183", 57, 0, 0.0, 378.5438596491228, 322, 742, 332.0, 510.40000000000003, 592.0999999999999, 742.0, 0.6457679540485118, 3.3864979621489346, 1.1256794902115175], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 926, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
