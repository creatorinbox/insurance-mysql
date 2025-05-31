import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Order {
  id: number;
  AGENT: {
    image: string;
    name: string;
    role: string;
  };
  EMAIL: string;
  PHONENUMBER: string;
  CITY: string;
  STATE: string;
  COUNTRY: string; 
   team: {
    images: string[];
  };
  status: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    AGENT: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    EMAIL: "lindsey@example.com",
    PHONENUMBER: "383984390",
    CITY: "Ahmedabad",
    STATE: "Gujarat",
    COUNTRY: "India",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    status: "Active",
  },
  {
    id: 2,
    AGENT: {
      image: "/images/user/user-18.jpg",
      name: "Michael Scott",
      role: "Project Manager",
    },
    EMAIL: "michael@example.com",
    PHONENUMBER: "384759201",
    CITY: "New York",
    STATE: "New York",
    COUNTRY: "USA",
    team: {
      images: [
        "/images/user/user-25.jpg",
        "/images/user/user-26.jpg",
        "/images/user/user-27.jpg",
      ],
    },
    status: "Pending",
  },
  {
    id: 3,
    AGENT: {
      image: "/images/user/user-19.jpg",
      name: "Sarah Connor",
      role: "Marketing Executive",
    },
    EMAIL: "sarah@example.com",
    PHONENUMBER: "927461028",
    CITY: "Sydney",
    STATE: "New South Wales",
    COUNTRY: "Australia",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    status: "Active",
  },
  {
    id: 4,
    AGENT: {
      image: "/images/user/user-20.jpg",
      name: "David Warner",
      role: "Sales Manager",
    },
    EMAIL: "david@example.com",
    PHONENUMBER: "102847563",
    CITY: "Toronto",
    STATE: "Ontario",
    COUNTRY: "Canada",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    status: "Inactive",
  },
  {
    id: 5,
    AGENT: {
      image: "/images/user/user-21.jpg",
      name: "Emma Watson",
      role: "HR Manager",
    },
    EMAIL: "emma@example.com",
    PHONENUMBER: "564738291",
    CITY: "London",
    STATE: "England",
    COUNTRY: "UK",
    team: {
      images: [
        "/images/user/user-34.jpg",
        "/images/user/user-35.jpg",
        "/images/user/user-36.jpg",
      ],
    },
    status: "Active",
  },
];


export default function AgentTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  AGENT
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  EMAIL
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  PHONE NUMBER
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  CITY
                </TableCell><TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  STATE
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  COUNTRY
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
               
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={order.AGENT.image}
                          alt={order.AGENT.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.AGENT.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.AGENT.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.EMAIL}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.PHONENUMBER}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.CITY}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.STATE}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.COUNTRY}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
               
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
