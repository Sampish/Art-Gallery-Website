const path = require('path');

var express = require('express');

const fs = require('fs');

function isDataFileNotPresent(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return false;
    } catch (err) {
        return true;
    }
}

function findHighestId(data_object_list) {
    const highestId = data_object_list.reduce((maxId, artwork) => {
        return artwork.id > maxId ? artwork.id : maxId;
    }, 0);
    return highestId;
}

async function readFileAsJsonString(filePathName) {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(__dirname, filePathName);

        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve(false); // File not found, return false
                } else {
                    resolve(false); // Other error, return false
                }
            } else {
                try {
                    const jsonString = JSON.parse(data);
                    resolve(jsonString);
                } catch (parseError) {
                    resolve(false); // Error parsing JSON, return false
                }
            }
        });
    });
}

function updateArtworkData(filePath, dataList) {
    fs.writeFile(filePath, JSON.stringify(dataList), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}



module.exports = {
    isDataFileNotPresent,
    findHighestId,
    readFileAsJsonString,
    updateArtworkData
};