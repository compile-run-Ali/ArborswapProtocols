import React from 'react'
import Preview from '../Preview'
import SaleBox from '../Sale'
import UserPanel from '../UserPanel/UserPanel';
import AdminPanel from '../Admin/AdminPanel';
import FundRaised from '../Admin/FundRaised';
import { useState } from 'react';
import { useEffect } from 'react';
import Web3 from 'web3';
import SaleAbi from '../../../config/abi/PublicSale.json';

export default function PoolPageBase({ pool, visible, showModal, admin,objId ,isFinished,isCancelled}) {
  const [status, setStatus] = useState('Live')
  const [liquidityTokens, setLiquidityTokens] = useState(0);
  const [whitelistedUser, setWhitelistedUser] = useState(false);

  useEffect(() => {

    //if endDate is less than current date, set status to ended
    if (pool.endDate < new Date().getTime()/1000) {
      setStatus('Ended')
    } else if (pool.startDate > new Date().getTime()/1000){
      setStatus('Upcoming')
    }
  }, [])

  
  const getLiquidTokens = async (saleAddress) => {
    const web3 = new Web3(window.ethereum);
      try{
        if (pool.saleType==="private") return
        const sale = new web3.eth.Contract(SaleAbi, saleAddress);
        const liquidityTokens = await sale.methods.tokensAmountForLiquidity().call();
        setLiquidityTokens(liquidityTokens)
      } catch(err){
        console.log(err)
      }
    }

  useEffect(() => {
    if(pool){
      getLiquidTokens(pool.saleAddress)
      console.log(pool, 'whitelisting')
      if(pool.whiteisting){
        //check if user is whitelisted
        if(pool.whiteListedAddresses.includes(window.ethereum.selectedAddress.toLowerCase())){
          setWhitelistedUser(true)
        }
      }
    } 
  }, [pool])
  return (
    pool && (
      <div className="w-full flex justify-center">
        <div className="w-full px-4 md:px-0 md:flex md:w-10/12 md:gap-7">
          <div className="w-full md:w-[65%] bg-white dark:bg-dark-1 rounded-[10px] overflow-hidden">
            <Preview
            presalePrice={pool.presalePrice}
            symbol={pool.image}
            currency={pool.currency}
            listingPrice={pool.listing}
            tags2={pool.tags2}
              pool={pool}
              name={pool.name}
              icon={pool.image}
              is_private={pool.saleType === 'Private'}
              tags={pool.tags}
              token={pool.token}
              description={pool.description}
              address={pool.saleAddress}
              starts_on={pool.startDate}
              ends_on={pool.endDate}
              soft_cap={pool.softCap}
              hard_cap={pool.hardCap}
              first_release={pool.first_release}
              vesting_release={pool.vesting_release}
              unsold_tokens={pool.unsoldToken}
              liquidity={pool.amountLiquidity}
              lockup={pool.lockup}
              objId={objId}
              admin = {admin}
              finished = {isFinished}
            />
          </div>

          <div className="mt-14 md:mt-0 md:w-[35%] ">

            {admin ?
              <AdminPanel  status={pool.status} finished={isFinished} hard_cap={pool.hardCap} filled_percent={pool.filled_percent} soft_cap={pool.softCap} sale={pool} objId={objId} cancelled={isCancelled}/>
              : <SaleBox hard_cap={pool.hardCap} hard_cap_icon={pool.image} start_date={pool.startDate} soft_cap={pool.softCap}
                min_allocation={pool.minAllocation} max_allocation={pool.maxAllocation} status={pool.status} isCancelled={isCancelled}
                currency={pool.currency} ends_on={pool.endDate} showModal={showModal} token = {pool.token} presale_address={pool.saleAddress} sale={pool} visible={visible} whitelistedUser={whitelistedUser} whitelisting={pool.whiteisting} isFinished = {isFinished}/>
            }
            {
              admin && (pool.status === 'Ended'|| visible===false) &&
              <div className='mt-[30px]'>
                <FundRaised icon={pool.image} pool = {pool} status={pool.status} sale={pool} isFinished={isFinished}/>
              </div>
            }
            {pool.saleType !== 'private' && !admin && 
              <div className='mt-[30px]'>
                <UserPanel icon={pool.image} sale={pool} status={pool.status} isFinished={isFinished} isCancelled={isCancelled}/>
              </div>
            }
          </div>
        </div>
      </div>
    )
  )
}
