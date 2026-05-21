import Markdoc from "@markdoc/markdoc"

export async function GET() {
  const content = `# Markdoc Demo\n\nThis is **Markdoc** content.\n\n- item 1\n\n\`\`\`js\nconsole.log('hello markdoc')\n\`\`\``
  const ast = Markdoc.parse(content)
  const transformed = Markdoc.transform(ast)

  return new Response(JSON.stringify({ transformed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
