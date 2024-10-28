import { AppConfig } from "../config/config";
import AirtableBase from "../providers/airtable";

const { AirtableMaxRecords, AirtableView } = AppConfig;

//Example to get data Role of Users table from Airtable
export function useGetUsers() {
    const getUsers = async () => {
        const users = AirtableBase('Users').select({
            maxRecords: AirtableMaxRecords,
            view: AirtableView
        }).eachPage(
            function page(records, fetchNextPage) {
                records.forEach(
                    function(record) {
                        console.log('Retrieved', record.get('Role'));
                    }
                );
                fetchNextPage();
        
            },
            function done(err) {
                if (err) {
                    console.error(err); 
                    return; 
                }
            }
        );

        return users;
    }

    return { getUsers };
}