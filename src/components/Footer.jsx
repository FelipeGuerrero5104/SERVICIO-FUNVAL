import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-neutral-800 p-10 flex  justify-between">
      <div>
        <div className="flex flex-col gap-3">
          <h3 className="text-white text-sm">Contact us</h3>
          <div className="flex gap-3">
            <a href="https://www.fundaciondevalores.org/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class=" rounded-lg bg-blue-800 text-white p-2 size-8 "
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM8.547 4.505a8.25 8.25 0 1 0 11.672 8.214l-.46-.46a2.252 2.252 0 0 1-.422-.586l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 0 1-1.384-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.279-2.132Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
            <a href="+5022055151393">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-8 text-white rounded-lg bg-blue-800 p-2"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white text-sm">Follow us</h3>

          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/fundet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors "
            >
              <FaFacebook className="size-6" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC3mlp-KW6mSDrsfsp8OOlIQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 transition-colors "
            >
              <FaYoutube className="size-6" />
            </a>
            <a
              href="https://www.instagram.com/funvalinternacional?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700 transition-colors "
            >
              <FaInstagram className="size-6" />
            </a>
          </div>
        </div>
      </div>
      <div>
        <a href="https://forms.monday.com/forms/cd0d06a41c4dc554d4f8681df147227f?r=use1">
          <p className="text-white border border-white rounded-lg text-sm w-[170px] h-[30px] flex items-center justify-center">
            O Contact site support
          </p>
        </a>
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-white">Data retention summary</p>
          <p className="text-white">Get the mobile app</p>
          <p className="text-white">Reset user tour on this page</p>
        </div>
      </div>
      <div>
        <h3 className="text-white text-sm">Get mobile app</h3>
        <div className="flex flex-col gap-4  space-x-4 text-white mt-2">
          <div className="border border-white rounded w-[130px] h-[30px]">
            <a
            href="https://play.google.com/store/apps/details?id=com.moodle.moodlemobile"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            <FaGooglePlay className="text-2xl " />
            <span>Google Play</span>
          </a>
          </div>
          <div className="border border-white rounded w-[130px] h-[30px]">
            <a
            href="https://apps.apple.com/us/app/moodle/id633359593"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            
            <FaApple className="text-2xl " />
            <p className="text-xl">App Store</p>
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}