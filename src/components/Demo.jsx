import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";

import { useLazyGetSummaryQuery } from "../services/articles";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  // to save all articles
  const [allArticles, setAllArticles] = useState([]);

  // to save copy state
  const [copied, setCopied] = useState(false);

  // calling hook created by RTK
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // getting data from localstorage
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  // handle the copy click
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  // handler the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updateAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updateAllArticles);
      // console.log(newArticle)
      // console.log(allArticles)
      localStorage.setItem("articles", JSON.stringify(updateAllArticles));
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ➜
          </button>
        </form>
        {/* Browse URL History  */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy-icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p>{item.url}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Display the results  */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 text-center" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, we are facing error here...
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="blue_gradient font-satoshi font-bold text-xl">
                Article Summary
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-gray-700 text-sm">
                  {" "}
                  {article.summary}{" "}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
