"use client";

import React from "react";
import { useState } from "react";
import "./EditNamskeid.css";
import { updateNamskeid } from "../../../api/namskeid.ts";
import DeleteConfirmation from "../../DeleteConfirmation/DeleteConfirmation.tsx";
import { deleteEntry } from "../../../api/delete.ts";
import { ErrorType } from "../../../types/error.ts";
import { useSearchParams } from "next/navigation";

export default function AddNamskeid() {
  const searchParams = useSearchParams();

  const namskeidOrNull = searchParams.get("namskeid");
  const namskeid = namskeidOrNull
    ? JSON.parse(decodeURIComponent(namskeidOrNull))
    : null;

  const [name, setName] = useState(namskeid.name);
  const [description, setDescription] = useState(namskeid.description);
  const [level, setLevel] = useState(namskeid.level);
  const [startDate, setStartDate] = useState(namskeid.start_date.slice(0, 16));
  const [endDate, setEndDate] = useState(namskeid.end_date.slice(0, 16));

  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await deleteEntry(namskeid.id, "namskeid", token);
    if (res !== 204) {
      setErrors(res.errors);
      setLoading(false);
    } else {
      setDeleted(true);
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await updateNamskeid(
      name,
      description,
      level,
      startDate,
      endDate,
      token,
      namskeid.id,
    );

    if (res.errors) {
      setErrors(res.errors);
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  }

  return (
    <div>
      {errors && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>
              <p>{error.msg}</p>
            </li>
          ))}
        </ul>
      )}
      {loading ? (
        <p>Loading..</p>
      ) : deleted ? (
        <p>Námskeiði eytt!</p>
      ) : submitted ? (
        <p>Námskeiði breytt!</p>
      ) : (
        <>
          <form onSubmit={handleUpdate} className="edit-nam-form">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <select
              name="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="" disabled>
                Veldu erfiðleikastig
              </option>
              <option key="byrjendur" value="byrjendur">
                Byrjendur
              </option>
              <option key="miðstig" value="miðstig">
                Miðstig
              </option>
              <option key="hæsta stig" value="hæsta stig">
                Hæsta stig
              </option>
            </select>
            <div>
              <label htmlFor="start_date">Byrjar:</label>
              <input
                name="start_date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="end_date">Endar:</label>
              <input
                name="end_date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button type="submit">Uppfæra</button>
          </form>
          <DeleteConfirmation handleDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
