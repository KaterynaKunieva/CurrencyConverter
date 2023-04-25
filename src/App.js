import React from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("UAH");
  const [toCurrency, setToCurrency] = React.useState("USD");
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);
  const ratesRef = React.useRef({});
  React.useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json.reduce((res, val) => {
          res[val.cc] = val.rate;
          return res;
        }, {});
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn("Error " + err);
        alert("Error " + err.message);
      });
  }, []);

  const onChangeFromPrice = (value) => {
    let price = value;
    let result = value;
    if (fromCurrency === toCurrency) {
      setFromPrice(value);
      setToPrice(result);
    } else {
      if (fromCurrency !== "UAH") {
        price = value * ratesRef.current[fromCurrency];
      }
      if (toCurrency !== "UAH") {
        result = price / ratesRef.current[toCurrency];
      } else {
        result = value * ratesRef.current[fromCurrency];
      }
      setFromPrice(value);
      setToPrice(result.toFixed(2));
    }
  };
  const onChangeToPrice = (value) => {
    let price = value;
    let result = value;
    if (fromCurrency === toCurrency) {
      setFromPrice(value);
      setToPrice(result);
    } else {
      if (toCurrency !== "UAH") {
        price = value * ratesRef.current[fromCurrency];
      }
      if (fromCurrency !== "UAH") {
        result = price / ratesRef.current[fromCurrency];
      } else {
        result = value * ratesRef.current[toCurrency];
      }
      setFromPrice(result.toFixed(2));
      setToPrice(value);
    }
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);
  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
