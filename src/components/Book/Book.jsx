import { useEffect, useState } from "react";
import axios from "axios";
import categoryBaseUrl from "../../api/categoryApi";
import publisherBaseUrl from "../../api/publisherApi";
import bookBaseUrl from "../../api/bookApi";
import authorBaseUrl from "../../api/authorApi";

const Book = () => {
  const [error, setError] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  const [errorFlag, setErrorFlag] = useState(false);
  const [book, setBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    author: {
      id: "",
      name: "",
    },
    publisher: {
      id: "",
      name: "",
    },
    categories: [],
  });
  const [updateBook, setUpdateBook] = useState({
    id: "",
    name: "",
    stock: "",
    publicationYear: "",
    author: {
      id: "",
    },
    publisher: {
      id: "",
    },
    categories: [],
  });
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState([]);
  const [publisher, setPublisher] = useState([]);
  const [category, setCategory] = useState([]);
  const [bookListChange, setBookListChange] = useState(false);
  const [showBooks, setShowBook] = useState(false);
  const [showBookBtnName, setShowBookBtnName] = useState("Show All Book");
  const [checkStats, setCheckStats] = useState("");
  const [createButtonVisible, setCreateButtonVisible] = useState(true);
  const [updateButtonsVisible, setUpdateButtonsVisible] = useState(false);
  const [cheked, setCheked] = useState();
  const [selectedDefaultValue, setSelectedDefaultValue] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });

    setUpdateBook({
      ...updateBook,
      [name]: value,
    });
  };

  const handleUpdateBook = (
    id,
    name,
    publicationYear,
    stock,
    authorId,
    publisherId,
    categories
  ) => {
    setCreateButtonVisible(false);
    setUpdateButtonsVisible(true);

    const updateBookData = {
      id: id,
      name: name,
      publicationYear: publicationYear,
      stock: stock,
      author: { id: authorId },
      publisher: {
        id: publisherId,
      },
      categories: categories.map((cat) => ({ id: cat })),
    };

    setBook(updateBookData);

    setUpdateBook(updateBookData);
  };

  const handleUpdateSaveClick = () => {
    if (book.categories[0].id === undefined) {
      book.categories.shift();
    }

    if (
      book.name === "" ||
      book.name === undefined ||
      book.publicationYear === "" ||
      book.publicationYear === undefined
    ) {
      const emptyFieldErros = ["Empty Field"];
      const clearMsg = () =>
        setTimeout(() => {
          const clearError = [];
          setError(clearError);
          setErrorFlag(false);
        }, 2000);
      setError(emptyFieldErros);
      clearMsg();
    } else {
      axios
        .put(bookBaseUrl.baseUrl + "/" + updateBook.id, book)
        .then((res) => {
          setErrorFlag(false);
          setBookListChange(true);
          setBook({
            name: "",
            publicationYear: "",
            stock: "",
          });
          setCheked(false);

          setCheckStats("Updated");
          setSelectedDefaultValue(0);
          function clearStats() {
            setTimeout(() => {
              setCheckStats("");
              setCheked();
            }, 2000);
          }
          clearStats();
        })
        .catch((e) => {
          console.log(e);
          if (e.code === "ERR_NETWORK") {
            const err = ["Server Down"];
            setError(err);
          } else {
            setError(["Bad Request"]);
          }
        })
        .finally(setBookListChange(false))
        .finally(setSelectedDefaultValue());
    }
  };

  const handleSaveBook = () => {
    if (
      book.name === "" ||
      book.name === undefined ||
      book.publicationYear === "" ||
      book.publicationYear === undefined
    ) {
      const emptyFieldErros = ["Empty Field"];
      const clearMsg = () =>
        setTimeout(() => {
          const clearError = [];
          setError(clearError);
          setErrorFlag(false);
        }, 2000);
      setError(emptyFieldErros);
      clearMsg();
    } else {
      axios
        .post(bookBaseUrl.baseUrl, book)
        .then((res) => {
          setErrorFlag(false);
          setBookListChange(true);
          setBook({
            name: "",
            publicationYear: "",
            stock: "",
            author: { id: "", name: "" },
            publisher: { id: "", name: "" },
            categories: [],
          });
          setCheked(false);
          setSelectedDefaultValue(0);
          setCheckStats("Created");
          function clearStats() {
            setTimeout(() => {
              setCheckStats("");
              setCheked();
            }, 2000);
          }
          clearStats();
        })
        .catch((e) => {
          if (e.code === "ERR_NETWORK") {
            const err = ["Server Down"];
            setError(err);
          } else {
            const err = ["Bad Request. Contact a developer."];
            setError(err);
            console.log(e);
          }
        })
        .finally(setBookListChange(false))
        .finally(setSelectedDefaultValue());
    }
  };

  useEffect(() => {
    if (error.length > 0) {
      setErrorMsg(error);
      setErrorFlag(true);
    }
  }, [error]);

  useEffect(() => {
    setSelectedDefaultValue();
    axios.get(bookBaseUrl.baseUrl).then((res) => {
      setBooks(res.data);
    });
  }, [bookListChange]);

  const handleShowBook = () => {
    if (showBooks) {
      setShowBookBtnName("Show All Category");
      return setShowBook(false);
    }
    setShowBookBtnName("Hidden List");
    return setShowBook(true);
  };

  const handleDeleteBook = (id) => {
    console.log(id);
    axios
      .delete(bookBaseUrl.baseUrl + "/" + id)
      .then((res) => {
        setBookListChange(true);
        setCheckStats("Deleted");
        function clearStats() {
          setTimeout(() => {
            setCheckStats("");
          }, 2000);
        }
        clearStats();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(setBookListChange(false));
  };

  const handleCancelClick = () => {
    setSelectedDefaultValue(0);
    setCheked(false);
    setTimeout(() => {
      setSelectedDefaultValue();
      setCheked();
    }, 100);
    setBook({
      name: "",
      publicationYear: "",
      stock: "",
    });
    setUpdateButtonsVisible(false);
    setCreateButtonVisible(true);
  };

  useEffect(() => {
    axios.get(authorBaseUrl.baseUrl).then((res) => {
      setAuthor(res.data);
    });
    axios.get(publisherBaseUrl.baseUrl).then((res) => {
      setPublisher(res.data);
    });
    axios.get(categoryBaseUrl.baseUrl).then((res) => {
      setCategory(res.data);
    });
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="general-form">
          <h3>{checkStats}</h3>
          <div className="form-input">
            <input
              name="name"
              placeholder="Book Name"
              required
              type="text"
              value={book.name}
              onChange={handleChange}
            />

            <input
              name="stock"
              placeholder="Book Stock"
              required
              type="number"
              value={book.stock}
              onChange={handleChange}
            />

            <input
              name="publicationYear"
              placeholder="Book Year"
              required
              type="number"
              value={book.publicationYear}
              onChange={handleChange}
            />
            <select
              name="author"
              value={selectedDefaultValue}
              onChange={(e) =>
                setBook({ ...book, author: { id: e.target.value } })
              }
            >
              <option value={0} disabled selected>
                Select Author
              </option>
              {author?.map((e) => {
                return (
                  <>
                    <option value={e.id}>{e.name}</option>
                  </>
                );
              })}
            </select>

            <select
              value={selectedDefaultValue}
              onChange={(e) =>
                setBook({ ...book, publisher: { id: e.target.value } })
              }
            >
              <option value={0} disabled selected>
                Select Publisher
              </option>
              {publisher.map((e) => {
                return (
                  <>
                    <option value={e.id}>{e.name}</option>
                  </>
                );
              })}
            </select>

            <select
              className="selected-multiple-categories"
              multiple
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => ({
                    id: option.value,
                  })
                );
                setBook({ ...book, categories: selectedOptions });
              }}
            >
              <option className="option" value={0} disabled>
                Categories
              </option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-btns-1">
            {createButtonVisible && (
              <button onClick={handleSaveBook}>Create Book</button>
            )}
            <button onClick={handleShowBook}>{showBookBtnName}</button>
          </div>

          {updateButtonsVisible && (
            <>
              <div className="form-btns">
                <button onClick={handleUpdateSaveClick}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
            </>
          )}

          {errorFlag && (
            <div>
              {errorFlag &&
                errorMsg.map((e) => {
                  return (
                    <>
                      <h1>{e}</h1>
                    </>
                  );
                })}
            </div>
          )}
        </div>
        {showBooks && (
          <div className="form-list-item">
            {books.map((book) => {
              return (
                <>
                  <div className="form-list">
                    <h3>Book: {book.name}</h3>
                    <h3>Stock: {book.stock}</h3>
                    <h3>Year: {book.publicationYear}</h3>
                    <h3>Author: {book.author.name}</h3>
                    <h3>Publisher: {book.publisher.name}</h3>
                    <h3>
                      Categories:{" "}
                      {book.categories && book.categories.length > 0
                        ? book.categories.map((e) => e.name).join(", ")
                        : "No Categories"}
                    </h3>
                    <button
                      onClick={(e) => {
                        handleDeleteBook(book.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        handleUpdateBook(
                          book.id,
                          book.name,
                          book.publicationYear,
                          book.stock,
                          book.author.id,
                          book.publisher.id,
                          book.categories.map((c) => c.id)
                        );
                      }}
                    >
                      Update
                    </button>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
export default Book;
