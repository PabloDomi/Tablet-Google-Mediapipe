import { useState } from 'react';
import { Platform } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const useHealthData = () => { 
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    const readSampleData = async (dateStart: string, dateEnd: string) => {
        // initialize the client
        const isInitialized = await initialize();
        if (!isInitialized) {
            return;
        }

        // request permissions
        await requestPermission([
            { accessType: 'read', recordType: 'Steps' },
            { accessType: 'read', recordType: 'Distance' },
            { accessType: 'read', recordType: 'FloorsClimbed' },
        ]);

        const timeRangeFilter: TimeRangeFilter = {
            operator: 'between',
            startTime: dateStart,
            endTime: dateEnd,
        };

        // Steps
        const steps = await readRecords('Steps', { timeRangeFilter });
        const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
        setSteps(totalSteps);

        // Distance
        const distance = await readRecords('Distance', { timeRangeFilter });
        const totalDistance = distance.reduce(
            (sum, cur) => sum + cur.distance.inMeters,
            0
        );
        setDistance(totalDistance);

        // Floors climbed
        const floorsClimbed = await readRecords('FloorsClimbed', {
            timeRangeFilter,
        });
        const totalFloors = floorsClimbed.reduce((sum, cur) => sum + cur.floors, 0);
        setFlights(totalFloors);
        };

        const readData = async (date1: string, date2: string) => {
            if (Platform.OS !== 'android') {
                return;
            }
            readSampleData(date1, date2);
        }

        return {
        steps,
        flights,
        distance,
        readData
        };
}

export default useHealthData;