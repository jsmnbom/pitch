const languages = {
    'da': 'Danish',
    'en_US': 'English (US)'
};

const req = require.context("../texts", true, /.txt$/);

const texts = [];
req.keys().forEach(path => {
    const url = req(path);
    const [_, lang, file] = path.split('/');
    const name = file.split('.').slice(0, -1).join('.');

    texts.push({
        lang: languages[lang],
        name,
        url
    });
});

export default texts;

