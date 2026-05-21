import { collection, config, fields } from "@keystatic/core"

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        publishedAt: fields.date({ label: "Published At" }),
        updatedAt: fields.date({ label: "Updated At", validation: { isRequired: false } }),
        author: fields.text({ label: "Author", validation: { isRequired: false } }),
        image: fields.text({ label: "Image", validation: { isRequired: false } }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
})
