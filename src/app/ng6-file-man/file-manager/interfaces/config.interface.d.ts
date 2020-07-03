export interface ConfigInterface {
    baseURL: string;
    api: {
        listFile: string;
        uploadFile: string;
        downloadFile: string;
        deleteFile: string;
        createFolder: string;
        renameFile: string;
        searchFiles: string;
    };
    options: {
        allowFolderDownload: boolean;
        showFilesInsideTree: boolean;
    };
}
