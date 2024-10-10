const URL =` https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`

const uploadFileIntoCloudinary = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append('upload_preset','chat-app-file') 
    const resposne = await fetch(URL,{
        method:'POST',
        body:formData
    })
    const responseData = await resposne.json()
    return responseData
}
export default uploadFileIntoCloudinary