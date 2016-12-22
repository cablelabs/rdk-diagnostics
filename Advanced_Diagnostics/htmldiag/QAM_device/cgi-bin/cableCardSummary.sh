#!/bin/sh
##########################################################################
# If not stated otherwise in this file or this component's Licenses.txt
# file the following copyright and licenses apply:
#
# Copyright 2016 RDK Management
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##########################################################################
if [ ! -f /etc/os-release ]; then
        export SNMPCONFPATH=/mnt/nfs/bin/target-snmp/sbin
else
        export SNMPCONFPATH=/tmp
fi
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin/
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`

cableCardData="/tmp/.cableCardData.json"
if [ -f /tmp/.cableCardData.json.pid ] && [ -d /proc/`cat /tmp/.cableCardData.json.pid` ]; then
   echo "Content-Type: text/html"
   echo ""
   cat $cableCardData
   exit 0
fi
echo $$ > /tmp/.cableCardData.json.pid

OID="OC-STB-HOST-MIB::ocStbHostCCAppInfoPage"

jsonPrefix="{"

jsonSuffix="}"

getPlainTextResponse() {
    index=$1
    plainResponse=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostCCAppInfoPage | \
               sed -e 's|<[^>]*>|#|g' -e 's|&nbsp;||g' | tr -s '#'`
    echo $plainResponse
}

response=`getPlainTextResponse`
UnitAddress=`echo $response | sed -e "s/.*UnitAddress\:#//g" | cut -d '#' -f1 | tr -d ' '`
DownloadState=`echo $response | sed -e "s/.*DL State\:#//g" | cut -d '#' -f1 | tr -d ' '`
LastError=`echo $response | sed -e "s/.*Last Error\:#//g" | cut -d '#' -f1 | tr -d ' '`
Manufacturer=`echo $response | sed -e "s/.*Man\:#//g" | cut -d '#' -f1 | tr -d ' '`
CCId=`echo $response | sed -e "s/.*CableCARD ID\:#//g" | cut -d '#' -f1 | tr -d ' '`
Hardware=`echo $response | sed -e "s/.*HW\:#//g" | cut -d '#' -f1 | tr -d ' '`
EntitlementStatus=`echo $response | sed -e "s/.*Entitlements\:#//g" | cut -d '#' -f1 | tr -d ' '`

# Identify the network controller MAC Address
thisNodeid=`snmpget -OQv -Ir -v 2c -c $snmpCommunityVal localhost MOCA11-MIB::mocaIfNodeID.3 | tr -d ' '`
ncNodeid=`snmpget -OQv -Ir -v 2c -c $snmpCommunityVal localhost MOCA11-MIB::mocaIfNC.3 | tr -d ' '`
NCMacAddress=""
if [ $thisNodeid -eq $ncNodeid ]; then
    NCMacAddress=`snmpget -OQv -Ir -v 2c -c $snmpCommunityVal localhost MOCA11-MIB::mocaIfMacAddress.3 | tr -d ' '`
else
    NCMacAddress=`snmpget -OQv -Ir -v 2c -c $snmpCommunityVal localhost MOCA11-MIB::mocaNodeMacAddress.3.$ncNodeid | tr -d ' '`
fi

data=""

data="$jsonPrefix \"UnitAddress\":\"$UnitAddress\" ,"
data="$data \"DownloadState\":\"$DownloadState\" ,"
data="$data \"LastError\":\"$LastError\" ,"
data="$data \"Manufacturer\":\"$Manufacturer\" ,"
data="$data \"Hardware\":\"$Hardware\" ,"
data="$data \"CCId\":\"$CCId\" ,"
data="$data \"NCMac\":\"$NCMacAddress\" ,"
data="$data \"EntitlementStatus\":\"$EntitlementStatus\"  $jsonSuffix"

echo $data > $cableCardData

echo "Content-Type: text/html"
echo ""
echo $data
