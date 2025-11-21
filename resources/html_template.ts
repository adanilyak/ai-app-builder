export function buildFullHtml(html: string, css: string, js: string) {
    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <style>
            ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
            ${js}
        </script>
    </body>
</html>
`;
}