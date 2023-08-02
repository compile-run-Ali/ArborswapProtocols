import { BigNumber } from "ethers";
import React from "react";
import { useEffect, useState } from "react";
import getSaleInfo from "utils/getSaleInfo";
import { formatBigToNum } from "utils/numberFormat";
import axios from "axios";
import { BACKEND_URL } from "config/constants/LaunchpadAddress";

export default function PercentFilled({ address, setFilled = () => {}, item, showModal,isFinished,isCancelled,saleType,sale }) {
  const [filled_percent, setFilledPercent] = useState("0");
  const [saleInfo, setSaleInfo] = useState(null);
  const [priceInBNB, setPriceInBNB] = useState(null);
  useEffect(() => {
    if (!sale) return;
    console.log(sale.currency.symbol)
    const result = getSaleInfo(address,saleType,sale.currency.symbol).then((res) => {
      console.log(res,sale,"saleingooo")
      setSaleInfo(res);
    });
  }, [showModal,sale]);
  // console.log(sale)
  async function getPrice() {
    if (!saleInfo) return;
    let res
    if(sale.saleType === "standard"||sale.currency.symbol === "BNB"){
    res = await saleInfo.totalBNBRaised;
    }
    else if(sale.saleType === "private"){
    res = await saleInfo.totalERC20Raised;
    }
    console.log(res,"in get price")
    const temp = BigNumber.from(res);
    setPriceInBNB(temp);
  }

  async function store() {
    console.log("store")
    if (!item) return;
    if(item.visible === false) return;
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/sale/${item._id}`,
        {
          visible: false,
        }
      );
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getPrice();
  }, [saleInfo]);

  useEffect(() => {
    if (priceInBNB === null) return;
    const getFilledPercent = async () => {
      try {
        const percents = priceInBNB.mul(100).div(saleInfo.hardCap);
        const newPercent = formatBigToNum(percents.toString(), 0, 1);
        setFilledPercent(newPercent);
        setFilled(newPercent);
        //make request to server if newPercent is 100
        if (parseInt(newPercent) === 100 || isFinished || isCancelled) {
          store();
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (saleInfo) {
      getFilledPercent();
    }
  }, [priceInBNB]);

  return (
    <div className="w-full bg-[#F5F1EB] dark:bg-dark-3 rounded-[5px] h-[18px] mt-[6px]">
      {filled_percent !== "0" && 
      <div
        className={`h-18px filled rounded-[5px] pr-2 flex justify-end items-center text-xs text-white`}
        style={{
          width: `${filled_percent}%`,
        }}
      >
        {/* here too where filled percentage */}
        {filled_percent}%
      </div>}
    </div>
  );
}
