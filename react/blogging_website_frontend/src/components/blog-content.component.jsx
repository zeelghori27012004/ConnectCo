/* eslint-disable react/prop-types */

// Component for displaying an image with an optional caption
const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} />
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

// Component for displaying a styled quote with an optional caption
const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
      <p className="text-xl leading-10 md:text-2xl">{quote}</p>
      {caption.length ? (
        <p className="w-full text-purple text-base">{caption}</p>
      ) : (
        ""
      )}
    </div>
  );
};

// Component for rendering a list with either ordered or unordered styles
const List = ({ style, items }) => {
  return (
    <ol
      className={`pl-5 ${style == "ordered" ? " list-decimal" : " list-disc"}`}
    >
      {items.map((listItem, i) => {
        return (
          <li
            key={i}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: listItem }}
          ></li>
        );
      })}
    </ol>
  );
};

// Main component for rendering blog content based on the block type
const BlogContent = ({ block }) => {
  let { type, data } = block;

  // Render a paragraph block
  if (type == "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  // Render a header block with dynamic styles for level 2 and level 3 headers
  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }
    return (
      <h2
        className="text-4xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  // Render an image block using the Img component
  if (type == "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  // Render a quote block using the Quote component
  if (type == "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  // Render a list block using the List component
  if (type == "list") {
    return <List style={data.style} items={data.items} />;
  }
};

export default BlogContent;
