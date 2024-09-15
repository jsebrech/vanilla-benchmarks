export const getRunParams = () => {
    return location.hash.substring(1).split(',').reduce((acc, curr) => {
        let [key, value] = curr.split('=');
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        if (!isNaN(value)) value = Number(value);
        acc[key] = value;
        return acc;
    }, {});
}