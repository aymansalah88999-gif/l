<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; text-align:center; }
        .container { border: 2px solid #333; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Certificate of Completion</h1>
        <p>This certifies that</p>
        <h2>{{ $enrollment->user->name }}</h2>
        <p>has completed the course</p>
        <h3>{{ $enrollment->course->title }}</h3>
        <p>on {{ $enrollment->updated_at->toDateString() }}</p>
        <p>Certificate ID: {{ $uuid }}</p>
    </div>
</body>
</html>
