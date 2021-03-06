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

// Handles HDMI section of Diagnostics under AV

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

var HDMIStatus = function(modelParam) 
{
    var model = modelParam;
    var hdmiStatusObjectMap = {};

    this.show = function() 
    {
        var hdmiStatusItem = new DetailsItem(Utils.scene,model);
        hdmiStatusItem.setSeparatorPlacement(0.3);
        
        hdmiStatusObjectMap["Device.Services.STBService.1.Components.HDMI.1.Status"] = hdmiStatusItem.addRow("Connection Status", "TODO");
        //hdmiStatusItem.addRow("Connected Device Type", "TODO");
        hdmiStatusObjectMap["Device.Services.STBService.1.Components.VideoOutput.1.HDCP"] = hdmiStatusItem.addRow("HDCP Status", "TODO");
        hdmiStatusObjectMap["Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioDB"] = hdmiStatusItem.addRow("HDMI Audio", "TODO");
        //hdmiStatusItem.addRow("HDMI Receiver", "TODO");
        //hdmiStatusItem.addRow("Receiver HDCP Compliance", "TODO");

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

        var HDMIStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(hdmiStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;

                hdmiStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.Services.STBService.1.Components.VideoOutput.1.HDCP"}, \
              {"name" : "Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioDB"}, \
              {"name" : "Device.Services.STBService.1.Components.HDMI.1.Status"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(HDMIStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = HDMIStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
