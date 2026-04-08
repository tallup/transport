{{--
  Enrollment usually stores a typed name (plain text). Canvas signatures use data:image/* URLs.
  DomPDF often breaks <img> for truncated VARCHAR data URIs — only render an image when the
  payload looks like a complete data URI.
--}}
@php
    $sig = trim((string) ($signature ?? ''));
    $len = strlen($sig);
    $looksLikeDataImage = $len >= 22 && \Illuminate\Support\Str::startsWith($sig, 'data:image/');
    // Truncated DB columns (e.g. varchar(255)) produce broken images; show as text or notice instead.
    $useImage = $looksLikeDataImage && $len >= 2000;
@endphp
@if($sig !== '')
    @if($useImage)
        <img src="{{ $sig }}" alt="Signature" style="max-width:220px;max-height:80px;border:1px solid #e2e8f0;" />
    @elseif($looksLikeDataImage)
        <p style="font-size:10px;color:#b45309;margin-top:6px;">
            A drawn signature may not have been stored completely (database length limit). The agreement text and parent acknowledgment on file still apply.
        </p>
    @else
        <p style="font-size:15px;font-style:italic;margin-top:8px;padding:10px 12px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:4px;">{{ $sig }}</p>
    @endif
@endif
