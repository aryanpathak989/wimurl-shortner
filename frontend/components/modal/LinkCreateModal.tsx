import { Link } from 'lucide-react'
import React from 'react'
import { toast } from 'react-toastify';
import NextLink from 'next/link';


interface ModalProps {
  setLinkCreatedModule: React.Dispatch<React.SetStateAction<boolean>>;
  shortCode: string | null;
}

export default function LinkCreateModal({ setLinkCreatedModule, shortCode }: ModalProps) {

    console.log("This is shorturl "+ shortCode)
      const handleCopy = () => {
        if (shortCode) {
          navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`)
          toast.success("Link copied!")
        }
      }
  return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black/60 min-h-screen w-full">
          <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[33%] flex flex-col items-center px-8 py-8 relative">
            <button
              className="absolute right-4 top-4 text-xl font-bold text-zinc-500 cursor-pointer"
              onClick={() => setLinkCreatedModule(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Your link is ready! 🎉</h2>
            <p className="text-gray-700 mb-2">
              Copy the link below to share it or choose a platform to share to.
            </p>
            <div className="bg-blue-50 rounded-lg w-full px-4 py-3 mb-3 flex flex-col items-center">
              <span className="font-semibold text-blue-700 text-lg mb-1 cursor-pointer">{process.env.NEXT_PUBLIC_API_URL}/{shortCode}</span>
              <div className="flex gap-3 w-full justify-center mt-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                  onClick={handleCopy}
                >
                  Copy link
                </button>
              </div>
            </div>
            {/* Social Icons Section */}
<div className="flex justify-center gap-8 flex-wrap py-6">
  {/* WhatsApp */}
  <a
    href={`https://wa.me/?text=${encodeURIComponent("shrl.me/"+shortCode)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="h-20 w-20 rounded-full flex flex-col items-center gap-2 cursor-pointer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 object-contain" viewBox="0 0 48 48">
      <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
      <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
      <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
      <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
      <path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
    </svg>
    <p className="text-base">WhatsApp</p>
  </a>

  {/* Facebook */}
  <a
    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent("shrl.me/"+shortCode)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="h-20 w-20 rounded-full flex flex-col items-center gap-2 cursor-pointer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 object-contain" viewBox="0 0 48 48">
      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
      <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
    </svg>
    <p className="text-base">Facebook</p>
  </a>

<a
  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("shrl.me/"+shortCode)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="h-20 w-20 rounded-full flex flex-col items-center gap-2 cursor-pointer"
>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 object-contain"
              viewBox="0 0 48 48"
            >
              <path
                fill="#0078d4"
                d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"
              ></path>
              <path
                d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z"
                opacity=".05"
              ></path>
              <path
                fill="#fff"
                d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499 C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"
              ></path>
            </svg>
  <p className="text-base">LinkedIn</p>
</a>


  {/* X - Twitter */}
  <a
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("shrl.me/"+shortCode)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="h-20 w-20 rounded-full flex flex-col items-center gap-2 cursor-pointer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 object-contain" viewBox="0 0 50 50">
      <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z"></path>
    </svg>
    <p className="text-base">X</p>
  </a>

</div>

 <div className="mt-4 w-full rounded-lg border border-primary bg-primary/10 py-4 px-2 flex flex-col items-center">
          <span className="font-semibold text-primary text-base mb-2">
            Want to track link clicks & see analytics?
          </span>
          <span className="text-gray-700 mb-3 text-sm text-center">
            <span className="font-semibold">Sign up or log in for FREE</span> and unlock click stats, link performance monitoring and more.<br />
          </span>
          <div className="flex gap-2 justify-center mt-2">
            <NextLink href="/signup" className="w-full flex justify-center">
              <button className="bg-primary text-white p-2 rounded-md font-semibold shadow hover:bg-primary/90 transition text-base w-full">
                Sign up
              </button>
            </NextLink>
            <NextLink href="/login" className="w-full flex justify-center">
              <button className="border border-primary px-4 py-2 rounded-md text-primary font-semibold hover:bg-primary/10 transition text-base w-full">
                Login
              </button>
            </NextLink>
          </div>
        </div>
          </div>
        </div>
  )
}
