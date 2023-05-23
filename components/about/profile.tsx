import SocialMediaList from "../social_media_list/social_media_list"
import profileImg from '../../public/images/profile.png'
import { useTranslation } from "react-i18next"

export default function profoilo():React.ReactElement {
  const { t } = useTranslation();
  const highlights = {
    [t("achievementCount")]: 12,
    [t("projectCount")]: 30,
    [t("customerCount")]: 5
  }
  return (
    <div id="profile" className="mt-12 grid grid-cols-1 md:grid-cols-3 md:mt-36 print:grid-cols-4 print:gap-x-5 md:gap-x-12 print:md:grid-cols-4 print:mt-14 print:md:mt-14">
      <div className="w-full mb-7 md:mb-0 print:mb-0">
        <img
          src={profileImg.src}
          height={332}
          width={326}
        />
      </div>
      <div className="relative col-span-2 text-primary dark:text-light font-notosans print:col-span-3">
        <div className="print:h-full print:flex print:justify-between print:flex-col">
          <h2 className="text-5xl font-bold tracking-wider print:text-base">{ t('name') }</h2>
          <ul className="mt-10 list-disc list-inside print:text-xs print:mt-0">
            <li>{ t('nickNameIs', { nickName: 'Wells' } ) }</li>
            <li>{ t('locatedIn') }</li>
            <li className="hidden print:list-item">{ t('self-intro') }</li>
          </ul>
          <p className="mt-10 print:hidden">{ t('self-intro') }</p>
        </div>
        <ul className="flex justify-between max-w-xs mt-10 print:hidden">
          {Object.keys(highlights).map(key => (
            <li key={key} className="text-6xl font-black text-center text-secondary">
              {highlights[key]}
              <h3 className="mt-1 text-sm text-center dark:text-light text-primary">{key}</h3>
            </li>
          ))}
        </ul>
        <div className="mt-12 xl:mt-0 xl:absolute xl:top-3 xl:right-0 print:hidden">
          <SocialMediaList/>
        </div>
      </div>
    </div>
  )
}
