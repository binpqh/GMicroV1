import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import Constant from '../../Config/Constants';
import ServiceEnum from '../../Variables/ServiceEnum';
import SignalRHub from '../../Utils/SignalRHub';
import RNFS from 'react-native-fs';

function log(message, level) {
    if (process.env.NODE_ENV !== 'production' || level === 'error') {
        console.log(message);
    }
}
/* 
Lấy param truyền lên API (dùng trong log lỗi lên server nếu một API nào đó bị lỗi) phương thức dùng trong hàm fetchData()
*/
function getAllUrlParams(url) {
    const queryString = url.split('?')[1];
    const params = {};

    if (queryString) {
        const paramArray = queryString.split('&');

        for (const param of paramArray) {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        }
    }

    return params;
}
/*
Dùng để gửi một số lỗi chỉ có message trong quá trình xử lý logic PHƯƠNG THỨC NÀY CÓ THỂ IMPORT DÙNG TRONG TOÀN ỨNG DỤNG
*/
export async function errorMessageLogToServer(message, url) {
    try {
        const logData = {
            errorCodeFromServer: `NETWORK_SERVICES.logErrorToServer`,
            urlAPI: url,
            jsonData: "{}",
            desc: message,
        };
        await postData(Constant.SERVER_URL_USER + ServiceEnum.LOGERRORS, logData);
        log(`NETWORK_SERVICES.logErrorToServer: logData: ${JSON.stringify(logData)}`);
    } catch (logError) {
        log('Lỗi khi gửi log lỗi lên server: ' + logError, 'error');
    }
}
/*
có chức năng gửi chi tiết lỗi với các thuộc tính logData được định nghĩa, phương thức này được dùng trong hàm fetchData()
*/
async function sendErrorLogToServer(logData) {
    try {
        await postData(Constant.SERVER_URL_USER + ServiceEnum.LOGERRORS, logData, 1);
        log(`NETWORK_SERVICES.logErrorToServer: logData: ${JSON.stringify(logData)}`);
    } catch (logError) {
        log('Lỗi khi gửi log lỗi lên server: ' + logError, 'error');
    }
}
/*
phương thức này có khả năng hoạt động linh hoạt thông qua các tham số truyền vào, là phương thức chính dùng để tương tác với server thông qua API, có khả năng log lỗi lên server, tự động lấy token mới nhất, tự động retry khi gặp một số lỗi nhất định
*/
async function fetchData(url = "", method, data = {}, type, contentType) {
    try {
        const token = SignalRHub.token;
        console.log("current Token:", token);
        if (token === null) {
            // await fetchToken();
        }

        const logMessage = (method === 'POST') ?
            `NETWORK_SERVICES.FETCHDATA: url: ${url}, method: ${method}, data: ${JSON.stringify(data)}, token: ${token}` :
            `NETWORK_SERVICES.FETCHDATA: url: ${url}, method: ${method}, param: ${JSON.stringify(getAllUrlParams(url))}, token: ${token}`;

        log(logMessage);

        var dataModified = undefined;
        if (method === "POST" && type != 1) {
            dataModified = JSON.stringify(data);
        }

        if (type === 1) { // upload
            dataModified = data;
        }


        const response = await axios({
            method,
            url,
            headers: {
                'Content-Type': contentType,
                'Authorization': `Basic ${token}`,
            },
            data: dataModified,
        });

        if (response.status === 200) {
            response.data.status = true;
            return response.data;
        } else {
            const logData = {
                errorCodeFromServer: JSON.stringify(response.error),
                urlAPI: url,
                jsonData: (method === 'POST') ? JSON.stringify(data) : JSON.stringify(getAllUrlParams(url)),
                desc: `Lỗi ${JSON.stringify(response.data.errors)} khi gọi API ${url} với phương thức ${method} từ thiết bị có id: ${DeviceInfo.getDeviceId()}`,
            };

            await sendErrorLogToServer(logData);

            return { status: false, data: {} };
        }
    } catch (error) {
        log('Lỗi khi gửi dữ liệu sử dụng token: ' + error, 'error');
        const logData = {
            errorCodeFromServer: 'try-catch internal func - NETWORK_SERVICES.FETCHDATA',
            urlAPI: url,
            jsonData: JSON.stringify(data),
            desc: 'Lỗi khi gọi hàm với message lỗi internal func:  ' + error,
        };
        if (!url.includes(ServiceEnum.LOGERRORS)) {
            await sendErrorLogToServer(logData);
        }
        return { status: false, data: {} };
    }
}

/* 
Là phương thức được thế kế giúp dev có thể gọi API với phương thức GET một cách đơn giản với những config có sẵn và chỉ cần truyền vào url + param nếu cần PHƯƠNG THỨC NÀY CÓ THỂ IMPORT DÙNG TRONG TOÀN ỨNG DỤNG
*/

export async function getData(url) {
    try {
        return await fetchData(url, 'GET', 2, "application/json");
    } catch (error) {
        log('Lỗi khi lấy dữ liệu sử dụng token: ' + error, 'error');
    }
}
/*
Là phương thức được thế kế giúp dev có thể gọi API với phương thức POST một cách đơn giản với những config có sẵn và chỉ cần truyền vào url và data dưới dạng object PHƯƠNG THỨC NÀY CÓ THỂ IMPORT DÙNG TRONG TOÀN ỨNG DỤNG
*/
export async function postData(url, data) {
    try {
        return await fetchData(url, 'POST', data, 2, "application/json");
    } catch (error) {
        log('Lỗi khi gửi dữ liệu sử dụng token: ' + error, 'error');
    }
}
/*
Là phương thức được thế kế giúp dev có thể gọi API với mục đích tải video lên server một cách đơn giản với những config có sẵn và chỉ cần truyền vào videoFile (URI của video), videoName là tên tùy chỉnh của video PHƯƠNG THỨC NÀY CÓ THỂ IMPORT DÙNG TRONG TOÀN ỨNG DỤNG
*/
export async function uploadVideo(videoFile, videoName) {
    try {
        const token = SignalRHub.token;
        const url = Constant.SERVER_URL_USER + ServiceEnum.UPLOAD;
        const deviceId = DeviceInfo.getDeviceId();
        const formData = new FormData();
        formData.append("DeviceId", deviceId);
        formData.append('VideoFile', {
            uri: videoFile,
            type: 'video/*',
            name: `${deviceId}_${videoName}.mp4`,
        });
        const response = await fetchData(url, "POST", formData, 1, "multipart/form-data")

        if (response.status) {
            return response;
        } else {
            console.log("Lỗi!!!", response.message);

            if (response.status === 401) {
                token = SignalRHub.token;
                return uploadVideo(file);
            } else {
                const logData = {
                    errorCodeFromServer: JSON.stringify(response.error),
                    urlAPI: url,
                    jsonData: JSON.stringify({ deviceId, "VideoFile": "Video" }),
                    desc: `Lỗi ${JSON.stringify(response.errors)} khi gửi video lên API ${url} từ thiết bị có id: ${deviceId}`,
                };
                //await sendErrorLogToServer(logData);
                return response;
            }
        }

    } catch (error) {
        log('Lỗi khi gửi video sử dụng token: ' + error, 'error');
        const logData = {
            errorCodeFromServer: 'try-catch internal func - NETWORK_SERVICES.UPLOADVIDEO',
            urlAPI: url,
            jsonData: JSON.stringify({ deviceId, videoFile }),
            desc: 'Lỗi khi gửi video lên API: ' + error,
        };

        await sendErrorLogToServer(logData);
        return false;
    }
}