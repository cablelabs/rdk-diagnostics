/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2016 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Handles Firmware section of Diagnostics under Install Summary

var packagePath = px.getPackageBaseFilePath();
packagePath += "/modules/";

px.configImport({"module:":packagePath});

px.import({
    detailsItem: 'module:detailsitem.js',
    command: 'module:command.js',
    utils: 'module:utils.js'
}).then(function importsAreReady(imports) {

var DetailsItem = imports.detailsItem;
var Command = imports.command;
var Utils = imports.utils.Utils;

var FirmwareStatus = function(modelParam) 
{
    var model = modelParam;
    var firmwareObjectMap = {};

    this.show = function() 
    {
        var firmwareItem = new DetailsItem(Utils.scene,model);
        firmwareItem.setSeparatorPlacement(0.3);
        firmwareObjectMap["Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename"] = firmwareItem.addRow("Running", "TODO");
        //firmwareItem.addRow("Applied Date/Time", "TBD");
        firmwareObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_FirmwareFilename"] = firmwareItem.addRow("Last Download Version", "TODO");
        firmwareObjectMap["Device.DeviceInfo.X_COMCAST-COM_FirmwareDownloadStatus"] = firmwareItem.addRow("Download Status", "TODO");
        
        //firmwareItem.addRow("Last Xconf Check", "TODO");
        firmwareObjectMap["FW Image Name"] = firmwareItem.addRow("FW Image Name", "TODO");
        firmwareObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM.BootStatus"] = firmwareItem.addRow("Boot Status", "TODO");
        if(Utils.isClientDevice == false)
        {
          //firmwareItem.addRow("Boot File", "TODO");
          //firmwareItem.addRow("BOOTR", "TODO");
        }

    }                  
                
    this.updateData = function()
    {                                                                                                  
        var options =  {                                                                      
          hostname: 'localhost',                                                            
          port: 10999,                                                                                                                    
          method : 'POST',                                                                  
          headers: {                                                                        
                'Content-Type' : 'application/json'                                         
          }                                                                                   
        };      

        var firmwareStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(firmwareObjectMap[json.paramList[i].name] === undefined)
                    continue;
                
                firmwareObjectMap[json.paramList[i].name].text = json.paramList[i].value;
                if(json.paramList[i].name == "Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename")
                {
                    firmwareObjectMap["FW Image Name"].text = json.paramList[i].value;
                }
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename"}, \
              {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_FirmwareFilename"}, \
              {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM.BootStatus"}, \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_FirmwareDownloadStatus"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(firmwareStatusCallback,errorCallback);

    }                                                            
                                                                  
}

module.exports = FirmwareStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
