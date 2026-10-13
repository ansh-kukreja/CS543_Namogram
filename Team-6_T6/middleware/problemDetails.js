function problem(res, status, title, detail, typeStr, errors = null, isXml = false) {
    const payload = {
        type: `https://namogram.com/errors/${typeStr}`,
        title: title,
        status: status,
        detail: detail
    };

    if (errors && errors.length > 0) {
        payload.errors = errors;
    }

    if (isXml) {
        let errNodes = '';
        if (errors) {
            errNodes = '<errors>' + errors.map(e => `<error><field>${e.field}</field><reason>${e.reason}</reason></error>`).join('') + '</errors>';
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<problem>
    <type>${payload.type}</type>
    <title>${payload.title}</title>
    <status>${payload.status}</status>
    <detail>${payload.detail}</detail>
    ${errNodes}
</problem>`;
        res.setHeader('Content-Type', 'application/problem+xml; charset=utf-8');
        return res.status(status).send(xml);
    }

    res.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
    return res.status(status).json(payload);
}

module.exports = { problem };