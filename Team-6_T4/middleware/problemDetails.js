// Single Error Shape Helper producing application/problem+json
function problem(res, status, title, detail, typeStr, errors = null) {
    const payload = {
        type: `https://namogram.com/errors/${typeStr}`,
        title: title,
        status: status,
        detail: detail
    };

    if (errors && errors.length > 0) {
        payload.errors = errors;
    }

    res.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
    return res.status(status).json(payload);
}

module.exports = { problem };