export async function getData(endPoint) {
    try {
        const response = await fetch(`http://localhost:3000/${endPoint}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
        return response;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function postData(element, endPoint) {
    try {
        const response = await fetch(`http://localhost:3000/${endPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(element)
        });
        return response;
    }
    catch (error) {
        return {}
    }
}

export async function getDataId(endPoint, id) {
    try {
        const response = await fetch(`http://localhost:3000/${endPoint}/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
        return response;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function deleteData(endPoint, id) {
    try {
        const response = await fetch(`http://localhost:3000/${endPoint}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return response;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function updateData(endPoint, id, object) {
    try {
        const response = await fetch(`http://localhost:3000/${endPoint}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });
        return response;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}