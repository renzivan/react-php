"use strict";
import Image from "next/image";
import { useEffect, useState } from "react";
import Pagination from './Pagination';
import {DateRangePicker} from "@nextui-org/date-picker";
import classNames from 'classnames';

export default function Table({ contacts }) {
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginatedContacts, setPaginatedContacts] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    return formattedDate
  }

  const formatDatePicker = (obj) => {
    const { day, month, year } = obj;

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
  
    return `${formattedMonth}/${formattedDay}/${year}`;
  }

  const handleConnect = async () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URI;
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=oauth%20crm.schemas.contacts.read%20crm.objects.contacts.read`;
    window.location.href = authUrl;
  }

  const filterByDate = (value) => {
    const startDate = new Date(formatDatePicker(value.start) + ' 00:00:00');
    const endDate = new Date(formatDatePicker(value.end) + ' 23:59:59');

    const x = contacts.filter((item) => {
      const itemDate = new Date(item['identity-profiles'][0].identities[1].timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredContacts(x);
    setSelectedDates({ start: formatDatePicker(value.start), end: formatDatePicker(value.end) });
    setTotalPages(Math.ceil(x.length / perPage));
    setCurrentPage(1);
  }

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts])

  useEffect(() => {
    setTotalPages(Math.ceil(filteredContacts?.length / perPage));
    const newPaginatedContacts = filteredContacts?.slice((currentPage - 1) * perPage, currentPage * perPage);
    setPaginatedContacts(newPaginatedContacts);
  }, [currentPage, filteredContacts, perPage]);

  return (
    <div className="shadow-xl bg-white border-gray-200 rounded-md w-full overflow-hidden">
      <DateRangePicker
        label="label ni"
        visibleMonths={2}
        isOpen={isShowDatePicker}
        onOpenChange={(value) => setIsShowDatePicker(value)}
        onChange={(value) => filterByDate(value)}
        classNames={{ base: 'invisible absolute -z-50' }}
      />
      <div className="flex justify-between items-center py-5 px-6">
        <span className="text-lg font-bold">Data</span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className={classNames(
                'flex items-center gap-12 border border-2 border-gray-300 text-gray-500 rounded h-8 text-xs px-3 font-bold',
                { 'cursor-not-allowed bg-slate-100': !filteredContacts || filteredContacts?.length === 0 }
              )}
              disabled={!filteredContacts || filteredContacts?.length === 0}
              onClick={() => setIsShowDatePicker(!isShowDatePicker)}
            >
              {selectedDates ? `${selectedDates?.start} - ${selectedDates?.end}` : "Customer Date" }
              <Image
                src="/caret.svg"
                alt="caret"
                className="dark:invert"
                width={8}
                height={5}
                priority
              />
            </button>
          </div>
          <button
            className="bg-indigo-500 text-white px-4 h-8 border border-gray-200 rounded text-xs"
            onClick={() => handleConnect()}
          >
            Connect
          </button>
        </div>
      </div>

      {paginatedContacts?.length > 0 ? (
        <div>
          <table className="table-fixed w-full">
            <thead className="text-left bg-gray-50 text-gray-500 text-xs font-medium border-y border-gray-200">
              <tr>
                <th className="pl-6 py-3">Email</th>
                <th className="pl-6 py-3">First Name</th>
                <th className="pl-6 py-3">Last Name</th>
                <th className="pl-6 py-3">Customer Date</th>
                <th className="pl-6 py-3">Lead Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.map(contact => (
                <tr key={contact.vid} className="text-sm text-slate-900 border-b border-gray-200">
                  <td className="p-6">{contact['identity-profiles'][0].identities[0].value}</td>
                  <td className="p-6">{contact.properties.firstname.value}</td>
                  <td className="p-6">{contact.properties.lastname.value}</td>
                  <td className="p-6">-</td>
                  <td className="p-6">{formatDate(contact['identity-profiles'][0].identities[1].timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-gray-50 py-5">Connect to show contacts.</div>
      )}
    </div>
  );
};
