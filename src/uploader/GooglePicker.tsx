import useDrivePicker from 'react-google-drive-picker'

const GooglePicker = () => {

    const [openPicker, authResponse] = useDrivePicker();
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const handleOpenPicker = () => {
        openPicker({
            clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT || "",
            developerKey: process.env.REACT_APP_GOOGLE_PICKER_API || "",
            viewId: "DOCS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            customScopes: ['https://www.googleapis.com/auth/drive.file'],
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log(data)
            },
        })
    }

    return (
        <div>
            <button onClick={() => handleOpenPicker()}>Open Picker</button>
        </div>
    )
}

export default GooglePicker