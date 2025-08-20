// src/components/Header.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon, PhoneIcon, PlayCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChartPieIcon, CursorArrowRaysIcon, FingerPrintIcon, SquaresPlusIcon, ArrowPathIcon } from '@heroicons/react/20/solid'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Check if user is logged in by looking for the token in localStorage
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    // Clear the JWT token from local storage or cookies
    localStorage.removeItem('token'); // Or remove the token from cookies if you're using cookies

    // Redirect to the login page
    navigate('/'); // Redirect to login page
  };
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a className="-m-1.5 p-1.5">
            <a href='/'><h2 className="text-2xl font-bold">FITNESS TRACKER</h2></a>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">

          <a href="/" className="text-sm/6 font-semibold text-gray-900">
            Home
          </a>
          <a href="/wingman" className="text-sm/6 font-semibold text-gray-900">
            Wingman AI
          </a>
          {token ? (
            <a
              href="/dashboard"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Dashboard
            </a>
          ) : null}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!token ? (
            <a
              href="/login"
              className="inline-block px-6 py-1 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out"
            >
              Log in
            </a>
          ) :
            <button
              onClick={handleLogout} // Add onClick handler for logout
              className="inline-block px-6 py-1 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out"
              aria-label="Logout"
            >

              Logout
            </button>
          }


        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fitness Tracker</span>
              <img
                alt="Logo"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="/wingman"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Wingman AI
                </a>
                {token ? (
                  <a
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </a>
                ) : null}
              </div>
              <div className="py-6">
                {!token ? (
                  <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
                ) :
                  <button
                    onClick={handleLogout} // Add onClick handler for logout
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    aria-label="Logout"
                  >

                    Logout
                  </button>
                }
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
