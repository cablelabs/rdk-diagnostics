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
logFileLocation="/tmp/testDiag.log"
echo `date` > $logFileLocation
read FILENAME
echo "File read started for HTML diagnostics page $FILENAME" >> $logFileLocation
RESULT=""
./mocaTransmissionRate.sh &
while read LINE
do
    RESULT="$RESULT$LINE\n"
done < $FILENAME

echo "Content-Type: text/html"
echo ""
echo "$RESULT"
