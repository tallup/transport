<?php

namespace App\Exceptions;

use Exception;

class CapacityExceededException extends Exception
{
    /**
     * Create a new exception instance.
     *
     * @param string $message
     * @param int $code
     * @param \Throwable|null $previous
     */
    public function __construct(string $message = "Route is at full capacity. No seats available.", int $code = 422, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Render the exception as an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $this->getMessage(),
                'error' => 'capacity_exceeded',
            ], $this->getCode());
        }

        return redirect()->back()->withErrors(['route_id' => $this->getMessage()]);
    }
}
