const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const newImages = await Promise.all(
        Array.from(files).map(async (file) => ({
            url: await convertToBase64(file), // Convert blob to base64
            caption: "",
        }))
    );

    setFormData((prevState) => ({
        ...prevState,
        images: [...(prevState.images || []), ...newImages],
    }));
};
