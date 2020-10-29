import {CONFIG} from './config';

const DOMAIN = CONFIG.baseApiHost;

export const RESTAPI = {
    // LOGIN API
    LOGIN: DOMAIN + '/login',
    // PCM API'S
    GETADVOCATE: DOMAIN + '/pcm-list',
    ADDORUPDATEPCM: DOMAIN + '/pcm',
    UPLOADPCMDOCUMENTS: DOMAIN + '/upload-docs',
    GETPCMDETAILS: DOMAIN + '/pcm-details',
    DELETEDOCUMENTS: DOMAIN + '/delete-docs',
    CALENDAR: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    GETACCOUNTDETAILS: DOMAIN + '/adv-account-details',
    GETDISTRICTS: DOMAIN + '/districts',
    GET_DISTRICTS_STATES: DOMAIN + '/district-states',
    GETADMINADVOCATELIST: DOMAIN + '/get_advocate_list',
    UPDATEADVOCATEDATA: DOMAIN + '/update-advocate'

}