import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Loader2, CheckCircle, Copy, Download } from 'lucide-react';
import UnenrollMfaModal from './UnenrollMfaModal';
import PasswordConfirmationModal from './PasswordConfirmationModal';

const TwoFactorAuth = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const checkMfaStatus = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      setError('Could not check MFA status.');
      console.error(error);
    } else if (data) {
      const totpFactor = data.all.find(f => f.factor_type === 'totp' && f.status === 'verified');
      setMfaEnabled(!!totpFactor);
      if (totpFactor) {
        setFactorId(totpFactor.id);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkMfaStatus();
  }, [checkMfaStatus]);

  const handleEnroll = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'nati',
    });
    if (error) {
      setError(error.message);
    } else {
      setQrCode(data.totp.qr_code);
      setFactorId(data.id);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: verificationCode,
    });
    if (error) {
      setError(error.message);
    } else if (data) {
      setRecoveryCodes(data.recovery_codes);
      setQrCode(null);
      setMfaEnabled(true);
    }
    setLoading(false);
  };

  const onUnenrollSuccess = () => {
    setMfaEnabled(false);
    setRecoveryCodes([]);
    setFactorId(null);
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const blob = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nati-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !qrCode) {
    return <div className="p-4 text-center">Checking 2FA status...</div>;
  }

  if (recoveryCodes && recoveryCodes.length > 0) {
    return (
      <div className="p-6 rounded-lg border border-green-500/30 bg-green-500/10 text-green-300">
        <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle /> 2FA Enabled Successfully!</h3>
        <p className="mt-2 text-sm opacity-90">Please save these recovery codes in a safe place. They can be used to access your account if you lose your device.</p>
        <div className="my-4 p-3 rounded-md bg-[var(--background-darkest)] font-mono text-sm grid grid-cols-2 gap-2">
          {recoveryCodes.map(code => <span key={code}>{code}</span>)}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCopyCodes} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-current text-sm">
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied!' : 'Copy Codes'}
          </button>
          <button onClick={handleDownloadCodes} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-current text-sm">
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>
    );
  }

  if (qrCode) {
    return (
      <div>
        <h3 className="font-medium">Set up Two-Factor Authentication</h3>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Scan the QR code with your authenticator app.</p>
        <div className="my-4 p-4 bg-white rounded-lg inline-block">
          <img src={qrCode} alt="2FA QR Code" />
        </div>
        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full max-w-xs rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Verify & Enable
          </button>
        </form>
        {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <UnenrollMfaModal
        isOpen={isUnenrollModalOpen}
        onClose={() => setIsUnenrollModalOpen(false)}
        onSuccess={onUnenrollSuccess}
        factorId={factorId}
      />
      <PasswordConfirmationModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleEnroll}
      />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
          <p className={`text-sm ${mfaEnabled ? 'text-green-400' : 'text-[var(--muted-foreground)]'}`}>
            {mfaEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <button
          onClick={mfaEnabled ? () => setIsUnenrollModalOpen(true) : () => setIsPasswordModalOpen(true)}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${mfaEnabled ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'border-[var(--border)] hover:bg-[var(--muted)]'}`}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>
    </>
  );
};

export default TwoFactorAuth;