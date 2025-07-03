"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/hooks/useAuth";

import {
  BoxCubeIcon,
  ChevronDownIcon,
  CopyIcon,
  DollarLineIcon,
  GridIcon,
 
  HorizontaLDots,
 
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  ShootingStarIcon,
  TableIcon,
  TimeIcon,
 
  UserIcon,
} from "../icons/index";
//import { CurrencyRupeeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
//import SidebarWidget from "./SidebarWidget";

interface AppHeaderProps {
  companyDetails?: {
    companyName: string;
    planName: string;
    logoUrl: string;
    colorCode: string;
    kitName: string;
  };
}

const AppSidebar: React.FC<AppHeaderProps> = ({ companyDetails }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  //const auth = useAuth();
  const { user } = useAuth();
  //  const token = req.cookies.get("token")?.value;
console.log('data',user)
  type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  };
  
  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      path: "/dashboard",
      //subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
    },
    // {
    //   icon: <CalenderIcon />,
    //   name: "Calendar",
    //   path: "/calendar",
    // },
    // {
    //   icon: <UserCircleIcon />,
    //   name: "User Profile",
    //   path: "/profile",
    // },
  
    // {
    //   name: "Forms",
    //   icon: <ListIcon />,
    //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    // },
    // {
    //   name: "Tables",
    //   icon: <TableIcon />,
    //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
    // },
    // {
    //   name: "Master",
    //   icon: <TableIcon />,
    //   subItems: [{ name: "Agent List", path: "/agent-tables", pro: false }],
    // }, 
    {
      name: "Products",
      icon: <ListIcon />,
      subItems: [{ name: "Product Pricing Slabs", path: "/policy-tables", pro: false },
       // { name: "policy Category", path: "/policy-pricing", pro: false },
      ],
    }, {
      name: "Insurance",
      icon: <ShootingStarIcon />,
      subItems: [{ name: "Insurance List", path: "/insurance-tables", pro: false }],
    },
    // {
    //   name: "Dealer",
    //   icon: <GroupIcon/>,
    //   subItems: [{ name: " Dealer creation", path: "/create-dealer", pro: false },
    //     { name: " Dealer Listing", path: "/dealer-tables", pro: false }
    //   ],
     
  
    // },  
    {
      name: "Customer",
      icon: <UserIcon />,
      subItems: [
         ...(user?.role === "DEALER"
          ? [ { name: " customer creation", path: "/create-customer", pro: false }]
          : []),
       
        { name: " customer Listing", path: "/customer-tables", pro: false }
      ],
     
  
    },
    // {
    //   name: "Distributor",
    //   icon: <UserCircleIcon />,
    //   subItems: [{ name: " Distributor creation", path: "/create-distributor", pro: false },
    //     { name: " Distributor Listing", path: "/distributor-tables", pro: false }
    //   ],
    // },
    // {
    //   name: "Payments",
    //   icon: <DollarLineIcon/>,
    //   // subItems: [{ name: "Dealer List", path: "/payment/dealer-payments", pro: false },
    //   //   { name: "Distributor List", path: "/payment/distributor-payments", pro: false },
    //   //   { name: "SuperAdmin List", path: "/payment/superadmin", pro: false }
    //   // ],
    //   subItems: [
    //     ...(user?.role === "DEALER"
    //       ? [{ name: "Insurance", path: "/payment/dealer-payments", pro: false }]
    //       : []),
    //     ...(user?.role === "DISTRIBUTOR"
    //       ? [{ name: "Dealer", path: "/payment/distributor-payments", pro: false }]
    //       : []),
    //     ...(user?.role === "SUPERADMIN"
    //       ? [{ name: "Distributor", path: "/payment/superadmin", pro: false }]
    //       : []),
    //   ],
    // },
      {
      name: "Partners",
      icon: <DollarLineIcon/>,
      // subItems: [{ name: "Dealer List", path: "/payment/dealer-payments", pro: false },
      //   { name: "Distributor List", path: "/payment/distributor-payments", pro: false },
      //   { name: "SuperAdmin List", path: "/payment/superadmin", pro: false }
      // ],
      subItems: [
        ...(user?.role === "DISTRIBUTOR"
          ? [{ name: " Dealer creation", path: "/create-dealer", pro: false },{ name: "Dealer", path: "/payment/distributor-payments", pro: false }]
          : []),
        ...(user?.role === "SUPERADMIN"
          ? [{ name: " Distributor creation", path: "/create-distributor", pro: false },{ name: "Distributor", path: "/payment/superadmin", pro: false }]
          : []),
      ],
    },
    {
      name: "Allocate Policy",
      icon: <CopyIcon />,
      subItems: [{ name: "Allocate Policy", path: "/policies", pro: false }],
     
  
    },
     {
      name: "Payment History",
      icon: <TimeIcon />,
      subItems: [
             ...(user?.role === "DISTRIBUTOR"
          ? [{ name: "Payment history", path: "/payment/history", pro: false }]
          : []),
        ...(user?.role === "SUPERADMIN"
          ? [{ name: "Payment history", path: "/payment/superadmin-history", pro: false }]
          : []),
      ],
  
    },
    {
      name: "Sales",
      icon: <TableIcon />,
      subItems: [{ name: "Set Sales Target", path: "/plans", pro: false }],
     
  
    },
   {
      icon: <GridIcon />,
      name: "Endorsement",
      path: "/endorsement-tables",
      //subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
    },
     {
      icon: <GridIcon />,
      name: "Warranty  Plan Code",
      path: "/plan-codes",
      //subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
    },
    {
      icon: <GridIcon />,
      name: "Manager",
      path: "/dealer/user",
     subItems: [{ name: "manager creation", path: "/dealer/user", pro: false },{ name: "userlist", path: "/dealer/user/list", pro: false }],
    },
    // {
    //   name: "Pages",
    //   icon: <PageIcon />,
    //   subItems: [
    //     { name: "Blank Page", path: "/blank", pro: false },
    //     { name: "404 Error", path: "/error-404", pro: false },
    //   ],
    // },
  ];
  
  const othersItems: NavItem[] = [
    {
      icon: <PieChartIcon />,
      name: "Charts",
      subItems: [
        { name: "Line Chart", path: "/line-chart", pro: false },
        { name: "Bar Chart", path: "/bar-chart", pro: false },
      ],
    },
    {
      icon: <BoxCubeIcon />,
      name: "UI Elements",
      subItems: [
        { name: "Alerts", path: "/alerts", pro: false },
        { name: "Avatar", path: "/avatars", pro: false },
        { name: "Badge", path: "/badge", pro: false },
        { name: "Buttons", path: "/buttons", pro: false },
        { name: "Images", path: "/images", pro: false },
        { name: "Videos", path: "/videos", pro: false },
      ],
    },
    {
      icon: <PlugInIcon />,
      name: "Authentication",
      subItems: [
        { name: "Sign In", path: "/signin", pro: false },
        { name: "Sign Up", path: "/signup", pro: false },
      ],
    },
  ];
  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };
  const filteredNavItems = navItems.filter((item) => {
    if (user?.role === "DEALER") {
        const isSubUser = user.subuser === "1"; // or use === 1 if it's a number
      if (
        item.name === "Policy" ||
        item.name === "Distributor" ||
        item.name === "Dealer" ||
        item.name === "Allocate Policy" ||
        item.name === "Payments" ||
                item.name === "Partners" ||

        item.name === "Payment History" ||

       item.name === "Sales" ||
             item.name === "Endorsement" ||
             item.name === "Warranty  Plan Code" ||
 (isSubUser && (item.name === "Dashboard" || item.name === "Manager"))
      ) {
        return false;
      }
    }
    if (user?.role === "DISTRIBUTOR") {
      if (
        item.name === "Policy" ||
        item.name === "Distributor" ||
        item.name === "Insurance" ||
        item.name === "Customer" ||
        item.name === "Allocate Policy" ||
        item.name === "Sales" ||
      item.name === "Endorsement" ||
         item.name === "Warranty  Plan Code" ||
         item.name ==="Manager"
      ) {
        return false;
      }
    }
    if (user?.role === "SUPERADMIN") {
      if (
        item.name === "Dealer" ||
        item.name === "Insurance"  ||
        item.name==="Manager"
      ) {
        return false;
      }
    }
  
  
    return true;
  });
  // const filteredNavItems = navItems.filter((item) => {
  //   if (item.name === "Dealer" && user?.role !== "DISTRIBUTOR") return false;
  //   if (item.name === "Distributor" && user?.role !== "SUPERADMIN") return false;
  //   if (item.name === "Customer" && user?.role !== "Dealer") return false;

  //   // if (item.name === "Payments") {
  //   //   item.subItems = item.subItems?.filter(sub => {
  //   //     if (sub.name === "Dealer List" && user?.role !== "DEALER") return false;
  //   //     if (sub.name === "Distributor List" && user?.role !== "DISTRIBUTOR") return false;
  //   //     if (sub.name === "SuperAdmin List" && user?.role !== "SUPERADMIN") return false;
  //   //     return true;
  //   //   });
  //   //   return item.subItems.length > 0;
  //   // }
  //   return true;
  // });
    return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
               src={companyDetails?.logoUrl || "/images/logo/default.png"}
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
{renderMenuItems(filteredNavItems, "main")}


              {/* {renderMenuItems(navItems, "main")} */}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {/* {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )} */}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? '' : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
