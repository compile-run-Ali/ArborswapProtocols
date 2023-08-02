import { useEthers } from "@usedapp/core";
import PreviewDetails from "components/Common/PreviewDetails";
import { Contract } from "ethers";
import React, { useEffect, useState } from "react";
import PublicSaleAbi from "../../../config/abi/PublicSale.json";
import PublicSaleErcAbi from "../../../config/abi/PublicSaleErcAbi.json";
import PrivateSaleAbi from "../../../config/abi/PrivateSale.json";
import PrivateSaleErcAbi from "../../../config/abi/PrivateSaleErcAbi.json";
import FairLaunchAbi from "../../../config/abi/FairlaunchSale.json";
import FairLaunchErcAbi from "../../../config/abi/FairlaunchErcAbi.json";
import useParticipated from "utils/getParticipated";
import { formatBigToNum } from "utils/numberFormat";
import { useModal } from "react-simple-modal-provider";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import getSaleInfo from "utils/getSaleInfo";


export default function SaleBox({ icon, sale, status, isFinished, isCancelled }) {
  const { account, library } = useEthers();
  const [allocated, setAllocated] = useState(0);
  const [bought, setBought] = useState(0);
  const [tokensWithdrawn, setTokensWithdrawn] = useState(false);
  const participated = useParticipated(sale.saleAddress, account);
  const { open: openLoadingModal, close: closeLoadingModal } =
  useModal("LoadingModal");
  const getUserParticipation = async () => {
    const contract = new Contract(
      sale.saleAddress,
      PublicSaleAbi,
      library.getSigner()
    );
    const userParticipation = await contract.userToParticipation(account);
    setBought(formatBigToNum(userParticipation[0].toString(), 18, 4));
    setAllocated(formatBigToNum(userParticipation[1].toString(), 18, 4));
    setTokensWithdrawn(userParticipation[2]);
  };

  const withdrawTokens = async () => {
    openLoadingModal()
    if (tokensWithdrawn) {
      toast.error("Tokens already withdrawn");
      closeLoadingModal()
      return;
    }
    if (participated[0] === false) {
      toast.error("You have not participated in this sale");
      closeLoadingModal()
      return;
    }
    let contract;
    if (sale.currency.symbol === "BNB") {
      if (sale.saleType === "standard") {
        contract = new Contract(
          sale.saleAddress,
          PublicSaleAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "fairlaunch") {
        contract = new Contract(
          sale.saleAddress,
          FairLaunchAbi,
          library.getSigner()
        );
      }
    } else {
      if (sale.saleType === "standard") {
        contract = new Contract(
          sale.saleAddress,
          PublicSaleErcAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "fairlaunch") {
        contract = new Contract(
          sale.saleAddress,
          FairLaunchErcAbi,
          library.getSigner()
        );
      }
    }

    try {
      if(isCancelled){
        console.log("withdrawUserFundsIfSaleCancelled")
        const tx = await contract.withdrawUserFundsIfSaleCancelled();
        await tx.wait();

      }
      else{
      const tx = await contract.withdraw();
      await tx.wait();

      }
      toast.success("Tokens Withdrawn");
      window.location.reload();
    } catch (err) {
      toast.error("Transaction Failed");
      closeLoadingModal()
    }
    closeLoadingModal()
  };

  const withdrawParticipation = async () => {
    openLoadingModal()
    if (participated[0] === false) {
      toast.error("You have not participated in this sale");
      return;
    }
    let contract;
    if (sale.currency.symbol === "BNB") {
      contract = new Contract(
        sale.saleAddress,
        FairLaunchAbi,
        library.getSigner()
      );
    } else {
      contract = new Contract(
        sale.saleAddress,
        FairLaunchErcAbi,
        library.getSigner()
      );
    }

    try {
      const tx = await contract.withdrawParticipation();
      await tx.wait();
      toast.success("Participation Withdrawn");
    } catch (err) {
      toast.error("You Have Already Withdrawn Your Participation");
      closeLoadingModal()
    }
    closeLoadingModal()
  };
  console.log(tokensWithdrawn, "tokensWithdrawn");
  useEffect(() => {
    if (sale) {
      getUserParticipation();
     // getTokensWithdrawn();
    }
  }, [sale]);
  return (
    <>
      <div className="px-9 pb-9 bg-white dark:bg-dark-1 rounded-[20px]">
        <div className="w-full flex justify-center">
          <div className="w-1/2 py-5 flex justify-center items-center border-b-2 border-primary-green ">
            <span className="font-bold text-primary-green">User Panel</span>
          </div>
        </div>

        <PreviewDetails
          name={"My Contribution"}
          value={allocated + " " + sale.currency.symbol}
        />
        <PreviewDetails
          name={"My Reserved Tokens"}
          value={bought + " " + sale.token.tokenSymbol}
        />
      {isFinished && (
        <div className="flex flex-col items-center">
          <span className="font-medium text-gray dark:text-gray-dark text-sm mt-5">
            {tokensWithdrawn?"You claimed":"Available to Claim"}
          </span>

          <div className="mt-3 flex">
            <img src={icon} alt="pool-icon" className="w-6 h-6 mr-2" />
            <span className="font-bold text-dark-text dark:text-light-text text-xl">
              {bought} {sale.token.tokenSymbol}
            </span>
          </div>
        </div>
      )}
        {(status === "Ended" && isFinished) && (
          <div className="mt-7">
            <button
            disabled={tokensWithdrawn}
              onClick={withdrawTokens}
              className="w-full bg-primary-green rounded-md text-white font-bold py-4 disabled:bg-dim-text "
            >
              {tokensWithdrawn ? "Tokens Withdrawn" : "Withdraw Tokens"}
            </button>
          </div>
        )}
        {status !== "Ended" && sale.saleType === "fairlaunch" && (
          <div className="mt-7">
            <button
              onClick={withdrawParticipation}
              className="w-full bg-primary-green rounded-md text-white font-bold py-4"
            >
              Withdraw
            </button>
          </div>
        )}
      </div>
    </>
  );
}
