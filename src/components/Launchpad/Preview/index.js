import React, { useContext, useState } from "react";
import Info from "./Subcomponents/Info";
import TabSwitch from "./Subcomponents/TabSwitch";
import DonutChart from "./Subcomponents/DonutChart";
import TwitterSVG from "svgs/Socials/twitter";
import DribbleSVG from "svgs/Socials/dribble";
import PreviewDetails from "components/Common/PreviewDetails";
import DiscordSVG from "svgs/Socials/discord";
import TelegramSVG from "svgs/Socials/telegram";
import { formatBigToNum } from "utils/numberFormat";
import { Link } from "react-router-dom";
import GithubSVG from "svgs/Socials/github";
import { ThemeContext } from "context/ThemeContext/ThemeProvider";
import YouTubeEmbed from "./Subcomponents/YoutubeImbed";
import ProjectDetails from "../CreateSale/ProjectDetails";
import ConfirmModal from "../Admin/subComponents/ConfirmModal";

export default function Preview({
  pool,
  icon,
  name,
  currency,
  is_private,
  token,
  tags,
  tags2,
  description,
  address,
  starts_on,
  ends_on,
  soft_cap,
  hard_cap,
  first_release,
  vesting_release,
  unsold_tokens,
  presalePrice,
  listingPrice,
  liquidity,
  lockup,
  objId,
  admin,
  finished,
}) {
  const { theme } = useContext(ThemeContext);
  const [slide, setSlide] = useState("Presale");
  const [edit, setEdit] = useState(false);
  const [saleData, setSaleData] = useState({ ...pool });
  const [showModal, setShowModal] = useState(false);
  const supply = parseFloat(token.tokenSupply) / 10 ** token.tokenDecimals;
  return (
    <>
      {edit ? (
        <ProjectDetails
          setActive={setEdit}
          saleData={saleData}
          setSaleData={setSaleData}
          edit={edit}
          objId={objId}
        />
      ) : (
        <div className="px-9 py-9 my-4 relative ">
          <div className="flex flex-col">
          <div className="overflow-hidden ml-auto md:mb-0 mb-2">
            {tags2 && tags2?.split(",").map(
              (tag) =>
                tag !== "" &&
                tag === "Migration" ? (
                  <span
                    key={tag}
                    className="absolute text-sm right-[-60px] top-[0px] w-[170px] transform rotate-45 dark:bg-red-600 bg-pink-500 font-bold text-center text-white py-0"
                  >
                    {tag}
                  </span>
                ) : tag === "KYC" ? (
                  <span 
                    key={tag}
                    className="text-[10px] font-bold bg-primary-green py-[2px] px-2 text-white rounded-[5px] mr-2 "
                  >
                    {tag}
                  </span>
                ) : tag === "SAFU" ? (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-purple-400 py-[2px] px-2 text-white rounded-[5px] mr-2 "
                  >
                    {tag}
                  </span>
                ) : tag === "AUDIT" ? (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-blue-400 py-[2px] px-2 text-white rounded-[5px] mr-2 "
                  >
                    {tag}
                  </span>
                ): null
            )}

          </div>

          <Info
            name={name}
            icon={icon}
            is_private={is_private}
            tags={tags}
            pool={pool}
            setEdit={setShowModal}
            edit={showModal}
            admin={admin}
          />
          </div>
          {showModal && (
            <ConfirmModal
              runFunction={setEdit}
              description={"Edit sale details?"}
              title={"Edit Sale"}
              setShowModal={setShowModal}
            />
          )}

          <div className="mt-6 flex md:hidden gap-5 ml-[70px]">
            {pool.github !== "" && (
              <Link to={pool.github} target="_blank" rel="noopener noreferrer">
                <GithubSVG
                  className="w-5 h-5"
                  outer={`${theme === "dark" ? "#fff" : "#464754"}`}
                  inner={`${theme === "dark" ? "#464754" : "#fff"}`}
                />
              </Link>
            )}
            {pool.discord !== "" && (
              <Link to={pool.discord} target="_blank" rel="noopener noreferrer">
                <DiscordSVG className="fill-dark-text dark:fill-light-text " />
              </Link>
            )}
            {pool.telegram !== "" && (
              <Link
                to={pool.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramSVG className="fill-dark-text dark:fill-light-text " />
              </Link>
            )}
            {pool.twitter !== "" && (
              <Link to={pool.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterSVG className="fill-dark-text dark:fill-light-text" />
              </Link>
            )}{" "}
            {pool.website !== "" && (
              <Link to={pool.website} target="_blank" rel="noopener noreferrer">
                <DribbleSVG className="fill-dark-text dark:fill-light-text " />
              </Link>
            )}
          </div>
          <div className="mt-10">
            <span className="font-medium text-sm text-gray dark:text-gray-dark">
              {description}
              {pool.youtube && pool.youtube !== "" && (
                <YouTubeEmbed embedCode={pool.youtube} />
              )}
            </span>
          </div>

          <TabSwitch slide={slide} setSlide={setSlide} />

          {slide === "Presale" && (
            <div className="mt-5">
              <PreviewDetails
                name={"Presale Address"}
                value={address}
                enable_copy
                address={true}
              />
              <PreviewDetails
                name={"Presale Starts on"}
                value={new Date(starts_on * 1000)
                  .toUTCString()
                  .replace(" GMT", " UTC")}
              />
              <PreviewDetails
                name={!finished? "Presale Ends on" : "Presale Ended on"}
                value={new Date(ends_on * 1000)
                  .toUTCString()
                  .replace(" GMT", " UTC")}
              />
              <PreviewDetails
                name={"Soft Cap"}
                value={
                  soft_cap && soft_cap.toLocaleString() + " " + currency.symbol
                }
              />
              <PreviewDetails
                name={"Hard Cap"}
                value={
                  hard_cap && hard_cap.toLocaleString() + " " + currency.symbol
                }
              />
              {unsold_tokens && (
                <PreviewDetails name={"Unsold Tokens"} value={unsold_tokens} />
              )}
              <PreviewDetails
                name={"To be listed on"}
                value={pool.dex.name}
                icon={pool.dex.icon}
              />
              {liquidity && (
                <PreviewDetails
                  name={"Tokens for Liquidity"}
                  value={
                    (
                      listingPrice *
                      (liquidity / 100) *
                      hard_cap
                    ).toLocaleString() +
                    " " +
                    token.tokenSymbol
                  }
                />
              )}
              {hard_cap && presalePrice && (
                <PreviewDetails
                  name={"Tokens for Presale"}
                  value={
                    (hard_cap * presalePrice).toLocaleString() +
                    " " +
                    token.tokenSymbol
                  }
                />
              )}
              {liquidity && (
                <PreviewDetails
                  name={"Tokens for Liquidity (%)"}
                  value={liquidity + "%"}
                />
              )}
              {lockup && (
                <PreviewDetails
                  name={"Liquidity Lockup Time (Days)"}
                  value={lockup}
                />
              )}
              {first_release && (
                <PreviewDetails name={"First Release"} value={first_release} />
              )}
              {vesting_release && (
                <PreviewDetails
                  name={"Vesting Release"}
                  value={vesting_release}
                />
              )}
            </div>
          )}
          {slide === "Token" && (
            <div className="mt-5">
              <PreviewDetails name={"Token Name"} value={token.tokenName} />
              <PreviewDetails name={"Token Symbol"} value={token.tokenSymbol} />
              <PreviewDetails
                name={"Token Decimals"}
                value={token.tokenDecimals}
              />
              <PreviewDetails
                name={"Total Supply"}
                value={
                  token.tokenSupply &&
                  formatBigToNum(token.tokenSupply, token.tokenDecimals)
                }
              />
              <PreviewDetails
                name={"Token Address"}
                value={token.tokenAddress}
                enable_copy={true}
                address={true}
              />

              <div className="mt-10">
                <span className="font-semibold text-dark-text dark:text-light-text">
                  Token Metrics
                </span>
                <div className="flex items-center mt-7">
                  <div className="w-full ">
                    <DonutChart
                      presale={pool.presalePrice * hard_cap}
                      liquidity={pool.listing * (liquidity/100) * hard_cap}
                      supply={supply}
                      burned={pool.burned || 0}
                      locked={pool.locked || 0}
                      sale = {pool || 0}
                    />
                  </div>
                  {/* <div className="w-full pl-16">
                <Labels color={"#307856"} text={"Presale"} />
                <Labels color={"#585B79"} text={"Liquidity"} />
                <Labels color={"#F8CF6B"} text={"Unlocked"} /> */}
                  {/* <Labels color={"#C89211"} text={"Locked"} />
                                <Labels color={"#E56060"} text={"Burned"} />                                
                                 */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
