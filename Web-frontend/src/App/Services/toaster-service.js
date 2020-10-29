import { toast } from 'react-toastify';

const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
}

export const notifySuccess = (notifSuccessMsg) => toast.success(notifSuccessMsg, toastOptions);
 
export const notifyError = (notifErrorMsg) => toast.error(notifErrorMsg, toastOptions);
 
export const notifyInfo = (notifInfoMsg) => toast.info(notifInfoMsg, toastOptions);