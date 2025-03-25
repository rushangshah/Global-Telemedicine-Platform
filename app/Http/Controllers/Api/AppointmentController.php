<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $appointments = [];

        if ($user->role === 'doctor') {
            $appointments = Appointment::with(['patient'])
                ->where('doctor_id', $user->doctor->id)
                ->orderBy('appointment_date', 'asc')
                ->orderBy('appointment_time', 'asc')
                ->get();
        } else {
            $appointments = Appointment::with(['doctor.user'])
                ->where('patient_id', $user->id)
                ->orderBy('appointment_date', 'asc')
                ->orderBy('appointment_time', 'asc')
                ->get();
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required',
            'type' => 'required|in:in-person,virtual',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        $appointment = Appointment::create([
            'patient_id' => $request->user()->id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'type' => $request->type,
            'notes' => $request->notes,
            'status' => 'scheduled'
        ]);

        return $this->sendResponse($appointment, 'Appointment created successfully.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validator = Validator::make($request->all(), [
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required',
            'type' => 'required|in:in-person,virtual',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        $appointment->update($request->all());

        return $this->sendResponse($appointment, 'Appointment updated successfully.');
    }

    public function cancel(Appointment $appointment)
    {
        $appointment->update(['status' => 'cancelled']);
        return $this->sendResponse($appointment, 'Appointment cancelled successfully.');
    }

    public function show(Appointment $appointment)
    {
        return $this->sendResponse($appointment, 'Appointment retrieved successfully.');
    }
}
