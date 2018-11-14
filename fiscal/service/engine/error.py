import enum


class ErrorCode(enum.Enum):
    """
    Contains error codes that shall be
    communicated to consumer part of engine
    """
    SUCCESS = 0
    # values from 1 up to 200 are reserved
    # for answers of business handlers
    RESOURCE_NOT_FOUND = 192  # An element searched into resources is not there
    REQUEST_INVALID = 193     # It is not possible to consume request as it is comformed
    DBMS_TRANS_ISSUES = 194   # The result of a database transaction has return error info
    DBMS_SQL_ISSUES = 195     # Any kind of problem related to dbms queries
    DBMS_CONN_ISSUES = 196    # Any kind of problem related to dbms connection
    ETL_ISSUES = 197          # ETL means extract, transform, and load
    REQUEST_INCOMPLETE = 198  # Denotes a missing value in the request body expected
    DOCMAKER_ERROR = 199      # Problems related to docmaker stuff
    THIRD_PARTY_ISSUES = 200  # Lack interacting with third party entities

    # values from 201 up to 255 are reserved
    # for answers of engine mechanism
    MOD_BUSINESS_NOT_LOADED = 201
    MOD_BUSINESS_UNEXPECTED_FAIL = 202
    MODE_NOT_SUPPORTED = 203
    BUFF_INCOMPLETE = 204
