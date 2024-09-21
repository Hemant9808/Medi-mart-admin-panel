import React from 'react'




interface PopupProps {
  open: boolean
  heading: string

  onClose: () => void
  onContinue?: () => void

}

const Popup: React.FC<PopupProps> = ({ open, onClose, onContinue, heading }) => {
  if (!open) return null

  


  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-[1000]" // Ensure the z-index is high enough
      style={{ zIndex: 1000 }} // Inline style to override any other styles
    >
      <div className="fixed inset-0" onClick={onClose}></div>
      <div
        style={{
          animation: 'dropTop .3s linear'
        }}
        className={`w-auto max-w-lg mx-auto bg-white shadow-lg rounded-[1rem] z-[1010] p-6`} // Added padding for better spacing
      >
        <div className="flex items-center">
          {/* <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-gray-100">
           
          </div> */}
          <div className="ml-4 text-left">
            <h3 className={`text-xl font-bold leading-6 `}>
              {heading}
            </h3>
            {/* <p className={`mt-2 font-semibold text-sm `}>
              {body}
            </p> */}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
        <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="mr-2 inline-flex justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className=" inline-flex justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup
